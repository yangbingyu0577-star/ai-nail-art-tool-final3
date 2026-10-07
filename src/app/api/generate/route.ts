import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_CONSTRUCTION_LIST } from '@/lib/constructionList';
import type { ConstructionList } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY;

const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

function extractBase64FromDataUrl(dataUrl: string): string {
  const match = dataUrl.match(/^data:image\/[a-zA-Z]+;base64,(.+)$/);
  return match ? match[1] : dataUrl;
}

async function urlToBase64(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`无法获取图片: ${res.status}`);
  const buf = await res.arrayBuffer();
  return Buffer.from(buf).toString('base64');
}

async function analyzeImageWithZhipu(
  base64Image: string,
  instruction: string
): Promise<{ description: string; constructionList: ConstructionList }> {
  if (!ZHIPU_API_KEY) {
    return {
      description: '未配置智谱 API Key，使用默认施工清单',
      constructionList: DEFAULT_CONSTRUCTION_LIST,
    };
  }

  const prompt = `你是一位专业美甲师。请分析这张手部/指甲照片，并结合用户的设计需求"${instruction || '精美美甲设计'}"，返回一份详细的施工清单。

请以JSON格式返回，包含以下字段：
{
  "description": "对设计方案的文字描述",
  "constructionList": {
    "materials": [{ "name": "材料名称", "brand": "品牌", "cost": 价格数字, "purchase_channel": "购买渠道", "category": "base|color|decoration|topcoat" }],
    "tools": [{ "name": "工具名称", "brand": "品牌", "cost": 价格数字, "purchase_channel": "购买渠道", "category": "tool" }],
    "techniques": [{ "name": "技法名称", "difficulty": "简单|中等|困难", "description": "技法描述" }],
    "salonPrices": [{ "tier": "美甲店级别", "min": 最低价, "max": 最高价, "description": "描述" }],
    "totalMaterialCost": 材料总成本数字
  }
}

只返回JSON，不要其他文字。`;

  const response = await fetch(ZHIPU_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ZHIPU_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'glm-4v',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${base64Image}` },
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    console.error('[Zhipu API Error]', response.status, errText);
    throw new Error(`智谱API调用失败: ${response.status}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('智谱API返回内容为空');
  }

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : content;
    const parsed = JSON.parse(jsonStr);

    return {
      description: parsed.description || '美甲设计方案',
      constructionList: parsed.constructionList || DEFAULT_CONSTRUCTION_LIST,
    };
  } catch {
    console.error('[Zhipu Parse Error] Failed to parse response');
    return {
      description: content,
      constructionList: DEFAULT_CONSTRUCTION_LIST,
    };
  }
}

function buildPollinationsPrompt(instruction: string, description: string): string {
  const base = 'beautiful nail art design on human hand, professional manicure, close-up photo, high quality, detailed';
  const userReq = instruction || description || 'elegant nail design';
  return `${base}, ${userReq}, soft pink and rose tones, delicate decoration`;
}

async function generateNailImage(prompt: string): Promise<string> {
  const encodedPrompt = encodeURIComponent(prompt);
  const seed = Math.floor(Math.random() * 1000000);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true&model=flux`;

  return url;
}

async function saveToKV(record: {
  instruction: string;
  imageUrl: string;
  description: string;
  timestamp: string;
}): Promise<void> {
  try {
    const kv = await import('@vercel/kv');
    const id = `design:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
    await kv.kv.set(id, JSON.stringify(record));
    await kv.kv.lpush('designs:list', id);
  } catch (e) {
    console.error('[KV Save Error]', e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const images: string[] = body.images || [];
    const instruction: string = body.instruction || '精美美甲设计';

    if (images.length === 0) {
      return NextResponse.json(
        { success: false, error: '请至少上传一张素材图片' },
        { status: 400 }
      );
    }

    const firstImage = images[0];
    let base64Image: string;
    if (firstImage.startsWith('data:')) {
      base64Image = extractBase64FromDataUrl(firstImage);
    } else {
      base64Image = await urlToBase64(firstImage);
    }

    // Step 1: Analyze image with Zhipu AI (GLM-4V)
    let analysis: { description: string; constructionList: ConstructionList };
    try {
      analysis = await analyzeImageWithZhipu(base64Image, instruction);
    } catch (err) {
      console.error('[Analysis failed]', err);
      analysis = {
        description: '美甲设计方案',
        constructionList: DEFAULT_CONSTRUCTION_LIST,
      };
    }

    // Step 2: Generate nail art image with Pollinations AI
    const prompt = buildPollinationsPrompt(instruction, analysis.description);
    const imageUrl = await generateNailImage(prompt);

    // Step 3: Save record to Vercel KV
    const timestamp = new Date().toISOString();
    await saveToKV({
      instruction,
      imageUrl,
      description: analysis.description,
      timestamp,
    });

    return NextResponse.json({
      success: true,
      imageUrl,
      constructionList: analysis.constructionList,
      description: analysis.description,
      instruction,
      timestamp,
    });
  } catch (error) {
    console.error('[Generate Route Error]', error);
    const msg = error instanceof Error ? error.message : '未知错误';
    return NextResponse.json(
      { success: false, error: `生成失败: ${msg}` },
      { status: 500 }
    );
  }
}
