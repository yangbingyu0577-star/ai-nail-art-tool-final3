'use client';

import { useState, useCallback } from 'react';
import { ArrowLeft, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import LeftPanel from './LeftPanel';
import CenterPanel from './CenterPanel';
import RightPanel from './RightPanel';
import type { ConstructionList } from '@/lib/types';

interface StudioProps {
  onBack: () => void;
}

const DEFAULT_MATERIAL_LIBRARY = [
  { id: '1', name: '樱花粉渐变', category: '渐变', image_url: 'https://images.pexels.com/photos/3997389/pexels-photo-3997389.jpeg?auto=compress&cs=tinysrgb&w=400', description: '温柔的樱花粉色渐变效果' },
  { id: '2', name: '法式白边', category: '法式', image_url: 'https://images.pexels.com/photos/3997416/pexels-photo-3997416.jpeg?auto=compress&cs=tinysrgb&w=400', description: '经典法式白色微笑线' },
  { id: '3', name: '闪粉猫眼', category: '闪粉', image_url: 'https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg?auto=compress&cs=tinysrgb&w=400', description: '炫彩闪粉猫眼胶效果' },
  { id: '4', name: '珍珠贴饰', category: '贴饰', image_url: 'https://images.pexels.com/photos/3997394/pexels-photo-3997394.jpeg?auto=compress&cs=tinysrgb&w=400', description: '立体珍珠贴饰搭配' },
  { id: '5', name: '大理石纹', category: '纹理', image_url: 'https://images.pexels.com/photos/3997398/pexels-photo-3997398.jpeg?auto=compress&cs=tinysrgb&w=400', description: '高级大理石纹理效果' },
  { id: '6', name: '爱心手绘', category: '手绘', image_url: 'https://images.pexels.com/photos/3997405/pexels-photo-3997405.jpeg?auto=compress&cs=tinysrgb&w=400', description: '可爱爱心手绘图案' },
];

export default function Studio({ onBack }: StudioProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [instruction, setInstruction] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [constructionList, setConstructionList] = useState<ConstructionList | null>(null);
  const [isConstructionLoading, setIsConstructionLoading] = useState(false);
  const [leftOpen, setLeftOpen] = useState(true);
  const [mobileTab, setMobileTab] = useState<'left' | 'center' | 'right'>('center');
  const [generateError, setGenerateError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (uploadedImages.length === 0) return;
    setIsGenerating(true);
    setIsConstructionLoading(true);

    setGenerateError(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: uploadedImages,
          instruction,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setGeneratedImageUrl(data.imageUrl);
        setConstructionList(data.constructionList);
        setMobileTab('center');
      } else {
        throw new Error(data.error || '生成失败');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : '生成失败，请稍后重试';
      setGenerateError(msg);
    } finally {
      setIsGenerating(false);
      setIsConstructionLoading(false);
    }
  }, [uploadedImages, instruction]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-pink-50/40 via-gray-50 to-rose-50/40">
      <header className="h-12 flex items-center justify-between px-3 border-b border-pink-100 bg-white/60 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="w-7 h-7 rounded-lg hover:bg-pink-50 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-500" />
          </button>
          <span className="text-sm font-semibold text-gray-700 hidden sm:inline">NailAI Studio</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setLeftOpen(!leftOpen)}
            className="w-7 h-7 rounded-lg hover:bg-pink-50 flex items-center justify-center transition-colors hidden md:flex"
            title={leftOpen ? '收起左侧栏' : '展开左侧栏'}
          >
            {leftOpen ? <PanelLeftClose className="w-4 h-4 text-gray-500" /> : <PanelLeftOpen className="w-4 h-4 text-gray-500" />}
          </button>
        </div>
      </header>

      {/* Mobile tab switcher */}
      <div className="md:hidden flex border-b border-pink-100 bg-white/50 shrink-0">
        {(['left', 'center', 'right'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={`flex-1 py-2 text-xs font-medium transition-colors ${
              mobileTab === tab
                ? 'text-pink-500 border-b-2 border-pink-400 bg-pink-50/50'
                : 'text-gray-400'
            }`}
          >
            {tab === 'left' ? '素材' : tab === 'center' ? '预览' : '清单'}
          </button>
        ))}
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Left panel */}
        <div
          className={`${
            leftOpen ? 'w-72 lg:w-80' : 'w-0'
          } transition-all duration-300 shrink-0 overflow-hidden border-r border-pink-100 hidden md:block`}
        >
          {leftOpen && (
            <LeftPanel
              uploadedImages={uploadedImages}
              onImagesChange={setUploadedImages}
              instruction={instruction}
              onInstructionChange={setInstruction}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              materialLibrary={DEFAULT_MATERIAL_LIBRARY}
            />
          )}
        </div>

        {/* Mobile left panel */}
        <div className={`flex-1 min-h-0 ${mobileTab === 'left' ? 'block md:hidden' : 'hidden'}`}>
          <LeftPanel
            uploadedImages={uploadedImages}
            onImagesChange={setUploadedImages}
            instruction={instruction}
            onInstructionChange={setInstruction}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            materialLibrary={DEFAULT_MATERIAL_LIBRARY}
          />
        </div>

        {/* Center panel */}
        <div className={`flex-1 min-h-0 ${mobileTab === 'center' ? 'block' : 'hidden md:block'}`}>
          <CenterPanel
            imageUrl={generatedImageUrl}
            isGenerating={isGenerating}
            error={generateError}
            onDismissError={() => setGenerateError(null)}
          />
        </div>

        {/* Right panel */}
        <div className="w-72 lg:w-80 shrink-0 border-l border-pink-100 hidden md:block overflow-hidden">
          <RightPanel
            constructionList={constructionList}
            isLoading={isConstructionLoading}
          />
        </div>

        {/* Mobile right panel */}
        <div className={`flex-1 min-h-0 ${mobileTab === 'right' ? 'block md:hidden' : 'hidden'}`}>
          <RightPanel
            constructionList={constructionList}
            isLoading={isConstructionLoading}
          />
        </div>
      </div>
    </div>
  );
}
