'use client';

import { useState, useRef } from 'react';
import {
  ClipboardList, Package, Wrench, BookOpen, Store,
  ChevronDown, ChevronUp, ShoppingBag, Coins,
  Download, FileText, Image as ImageIcon, X,
} from 'lucide-react';
import type { ConstructionList } from '@/lib/types';

interface RightPanelProps {
  constructionList: ConstructionList | null;
  isLoading: boolean;
}

export default function RightPanel({ constructionList, isLoading }: RightPanelProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('materials');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const toggle = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleExportText = () => {
    if (!constructionList) return;
    const lines: string[] = [];
    lines.push('═══════════════════════════════════════');
    lines.push('         美甲施工清单');
    lines.push('═══════════════════════════════════════');
    lines.push('');
    lines.push('【所需材料】');
    constructionList.materials.forEach((m) => {
      lines.push(`  • ${m.name} | ${m.brand} | ¥${m.cost} | ${m.purchase_channel}`);
    });
    lines.push(`  材料总成本: ¥${constructionList.totalMaterialCost.toFixed(0)}`);
    lines.push('');
    lines.push('【所需工具】');
    constructionList.tools.forEach((t) => {
      lines.push(`  • ${t.name} | ${t.brand} | ¥${t.cost} | ${t.purchase_channel}`);
    });
    lines.push('');
    lines.push('【美甲技法】');
    constructionList.techniques.forEach((t) => {
      lines.push(`  • ${t.name} (${t.difficulty}) - ${t.description}`);
    });
    lines.push('');
    lines.push('【美甲店价格区间】');
    constructionList.salonPrices.forEach((s) => {
      lines.push(`  • ${s.tier}: ¥${s.min} - ¥${s.max}`);
      lines.push(`    ${s.description}`);
    });
    lines.push('');
    lines.push('═══════════════════════════════════════');
    lines.push(`生成时间: ${new Date().toLocaleString('zh-CN')}`);
    lines.push('═══════════════════════════════════════');

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `美甲施工清单-${Date.now()}.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleExportImage = async () => {
    if (!constructionList || !panelRef.current) return;
    const contentEl = panelRef.current.querySelector('[data-export-content]') as HTMLElement;
    if (!contentEl) return;

    const canvas = document.createElement('canvas');
    const padding = 32;
 const width = 420;
    const sections = contentEl.querySelectorAll('[data-export-section]');
    const headerHeight = 60;
    const sectionSpacing = 16;
    const footerHeight = 80;

    const measureSection = (el: Element): number => {
      const cs = window.getComputedStyle(el);
      return el.getBoundingClientRect().height + parseFloat(cs.marginTop || '0') + parseFloat(cs.marginBottom || '0');
    };

    let totalHeight = headerHeight + padding * 2 + footerHeight;
    sections.forEach((s) => {
      totalHeight += measureSection(s) + sectionSpacing;
    });

    canvas.width = width;
    canvas.height = totalHeight;
    const ctx = canvas.getContext('2d')!;

    const bgGrad = ctx.createLinearGradient(0, 0, 0, totalHeight);
    bgGrad.addColorStop(0, '#fdf6f8');
    bgGrad.addColorStop(1, '#f5eef0');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, totalHeight);

    let y = padding;
    ctx.fillStyle = '#e8919c';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('美甲施工清单', padding, y + 22);
    ctx.fillStyle = '#b0b0b0';
    ctx.font = '11px sans-serif';
    ctx.fillText(new Date().toLocaleString('zh-CN'), padding, y + 42);
    y += headerHeight;

    const drawSection = (
      title: string,
      items: { left: string; right: string; sub?: string }[],
      footer?: { label: string; value: string },
    ) => {
      ctx.fillStyle = '#d4849c';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`▸ ${title}`, padding, y + 14);
      y += 28;

      items.forEach((item) => {
        ctx.fillStyle = '#555';
        ctx.font = '12px sans-serif';
        const leftText = item.left;
        ctx.fillText(leftText, padding, y + 14);

        if (item.right) {
          ctx.fillStyle = '#e8919c';
          ctx.font = 'bold 12px sans-serif';
          const rightText = item.right;
          const rightWidth = ctx.measureText(rightText).width;
          ctx.fillText(rightText, width - padding - rightWidth, y + 14);
        }

        if (item.sub) {
          ctx.fillStyle = '#aaa';
          ctx.font = '10px sans-serif';
          ctx.fillText(item.sub, padding, y + 30);
          y += 18;
        }
        y += 22;
      });

      if (footer) {
        ctx.fillStyle = '#888';
        ctx.font = '11px sans-serif';
        ctx.fillText(footer.label, padding, y + 14);
        ctx.fillStyle = '#e8919c';
        ctx.font = 'bold 13px sans-serif';
        const fw = ctx.measureText(footer.value).width;
        ctx.fillText(footer.value, width - padding - fw, y + 14);
        y += 26;
      }
      y += sectionSpacing;
    };

    drawSection(
      '所需材料',
      constructionList.materials.map((m) => ({
        left: m.name,
        right: `¥${m.cost}`,
        sub: `${m.brand} · ${m.purchase_channel}`,
      })),
      { label: '材料总成本', value: `¥${constructionList.totalMaterialCost.toFixed(0)}` },
    );

    drawSection(
      '所需工具',
      constructionList.tools.map((t) => ({
        left: t.name,
        right: `¥${t.cost}`,
        sub: `${t.brand} · ${t.purchase_channel}`,
      })),
    );

    drawSection(
      '美甲技法',
      constructionList.techniques.map((t) => ({
        left: t.name,
        right: t.difficulty,
        sub: t.description,
      })),
    );

    drawSection(
      '美甲店价格区间',
      constructionList.salonPrices.map((s) => ({
        left: s.tier,
        right: `¥${s.min} - ¥${s.max}`,
        sub: s.description,
      })),
    );

    ctx.fillStyle = '#ccc';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('由 NailAI Studio 生成', width / 2, totalHeight - padding / 2);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `美甲施工清单-${Date.now()}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
    setShowExportMenu(false);
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-white/60 backdrop-blur-sm">
        <div className="px-4 py-3 border-b border-pink-100">
          <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-pink-400" />
            施工清单
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full border-2 border-pink-200 border-t-pink-400 animate-spin" />
            <p className="text-xs text-gray-400">生成施工清单中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!constructionList) {
    return (
      <div className="h-full flex flex-col bg-white/60 backdrop-blur-sm">
        <div className="px-4 py-3 border-b border-pink-100">
          <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-pink-400" />
            施工清单
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <ClipboardList className="w-10 h-10 text-pink-200 mx-auto mb-3" />
            <p className="text-xs text-gray-400">生成设计后</p>
            <p className="text-xs text-gray-400">施工清单将在此显示</p>
          </div>
        </div>
      </div>
    );
  }

  const { materials, tools, techniques, salonPrices, totalMaterialCost } = constructionList;

  const Section = ({
    id, icon: Icon, title, count, children,
  }: {
    id: string; icon: typeof Package; title: string; count: number; children: React.ReactNode;
  }) => (
    <div className="border-b border-pink-50">
      <button
        onClick={() => toggle(id)}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-pink-50/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-pink-400" />
          <span className="text-xs font-medium text-gray-600">{title}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-500">{count}</span>
        </div>
        {expandedSection === id ? (
          <ChevronUp className="w-3.5 h-3.5 text-gray-300" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-gray-300" />
        )}
      </button>
      {expandedSection === id && (
        <div className="px-3 pb-3 space-y-1.5 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white/60 backdrop-blur-sm">
      <div className="px-4 py-3 border-b border-pink-100 relative" ref={panelRef}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-pink-400" />
            施工清单
          </h2>
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-pink-100/60 hover:bg-pink-100 text-pink-500 text-[10px] font-medium transition-colors"
          >
            <Download className="w-3 h-3" />
            导出
          </button>
        </div>
        {showExportMenu && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setShowExportMenu(false)} />
            <div className="absolute top-full right-3 mt-1 z-30 rounded-xl bg-white shadow-xl shadow-pink-200/30 border border-pink-100 overflow-hidden animate-fade-in">
              <button
                onClick={handleExportText}
                className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-pink-50 transition-colors text-left"
              >
                <FileText className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[11px] text-gray-600">导出为文本</span>
              </button>
              <button
                onClick={handleExportImage}
                className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-pink-50 transition-colors text-left border-t border-pink-50"
              >
                <ImageIcon className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[11px] text-gray-600">导出为图片</span>
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin" data-export-content>
        <div data-export-section>
          <Section id="materials" icon={Package} title="所需材料" count={materials.length}>
            {materials.map((m, i) => (
              <div key={i} className="rounded-lg bg-white/60 p-2">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[11px] font-medium text-gray-600">{m.name}</span>
                  <span className="text-[11px] font-semibold text-pink-500 flex items-center gap-0.5">
                    <Coins className="w-3 h-3" />¥{m.cost}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <ShoppingBag className="w-2.5 h-2.5" />
                    {m.brand}
                  </span>
                  <span>{m.purchase_channel}</span>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-pink-100">
              <span className="text-[10px] text-gray-400">材料总成本</span>
              <span className="text-xs font-bold text-pink-500">¥{totalMaterialCost.toFixed(0)}</span>
            </div>
          </Section>
        </div>

        <div data-export-section>
          <Section id="tools" icon={Wrench} title="所需工具" count={tools.length}>
            {tools.map((t, i) => (
              <div key={i} className="rounded-lg bg-white/60 p-2">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[11px] font-medium text-gray-600">{t.name}</span>
                  <span className="text-[11px] font-semibold text-pink-500 flex items-center gap-0.5">
                    <Coins className="w-3 h-3" />¥{t.cost}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <ShoppingBag className="w-2.5 h-2.5" />
                    {t.brand}
                  </span>
                  <span>{t.purchase_channel}</span>
                </div>
              </div>
            ))}
          </Section>
        </div>

        <div data-export-section>
          <Section id="techniques" icon={BookOpen} title="美甲技法" count={techniques.length}>
            {techniques.map((t, i) => (
              <div key={i} className="rounded-lg bg-white/60 p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium text-gray-600">{t.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                    t.difficulty === '简单' ? 'bg-green-100 text-green-600' :
                    t.difficulty === '中等' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-rose-100 text-rose-600'
                  }`}>
                    {t.difficulty}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed">{t.description}</p>
              </div>
            ))}
          </Section>
        </div>

        <div data-export-section>
          <Section id="salon" icon={Store} title="美甲店价格区间" count={salonPrices.length}>
            {salonPrices.map((s, i) => (
              <div key={i} className="rounded-lg bg-white/60 p-2">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[11px] font-medium text-gray-600">{s.tier}</span>
                  <span className="text-[11px] font-bold text-pink-500">¥{s.min} - ¥{s.max}</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed">{s.description}</p>
              </div>
            ))}
            <div className="rounded-lg bg-pink-50/60 p-2 mt-1.5">
              <p className="text-[10px] text-gray-400 leading-relaxed">
                自购材料约 ¥{totalMaterialCost.toFixed(0)}，加上工具和人工，可参考以上价格区间选择适合的美甲店。
              </p>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
