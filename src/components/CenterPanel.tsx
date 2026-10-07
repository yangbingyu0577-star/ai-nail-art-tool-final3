'use client';

import { Hand, Download, AlertCircle, X } from 'lucide-react';

interface CenterPanelProps {
  imageUrl: string | null;
  isGenerating: boolean;
  error: string | null;
  onDismissError: () => void;
}

export default function CenterPanel({ imageUrl, isGenerating, error, onDismissError }: CenterPanelProps) {
  const downloadImage = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.download = `nail-design-${Date.now()}.png`;
    link.href = imageUrl;
    link.target = '_blank';
    link.click();
  };

  if (!imageUrl && !isGenerating && !error) {
    return (
      <div className="h-full flex items-center justify-center nail-gradient">
        <div className="text-center">
          <div className="w-20 h-28 mx-auto rounded-t-full rounded-b-lg bg-gradient-to-b from-pink-200/40 to-rose-200/30 mb-4 animate-float" />
          <p className="text-sm text-gray-400">上传素材后点击「生成美甲设计」</p>
          <p className="text-xs text-gray-300 mt-1">AI 生成的设计图将在这里展示</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white/40 backdrop-blur-sm">
      <div className="px-4 py-3 border-b border-pink-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Hand className="w-4 h-4 text-pink-400" />
          设计预览
        </h2>
        {imageUrl && (
          <button
            onClick={downloadImage}
            title="下载图片"
            className="w-7 h-7 rounded-lg bg-white/60 hover:bg-pink-50 flex items-center justify-center transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
          </button>
        )}
      </div>

      <div className="flex-1 relative min-h-0 flex items-center justify-center p-4">
        {error && !isGenerating && (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="max-w-sm text-center bg-white/70 rounded-2xl p-6 border border-rose-100">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-rose-50 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-rose-400" />
              </div>
              <p className="text-sm text-gray-600 font-medium mb-1">生成失败</p>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">{error}</p>
              <button
                onClick={onDismissError}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 text-xs font-medium transition-colors"
              >
                <X className="w-3 h-3" /> 关闭
              </button>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm">
            <div className="text-center">
              <div
                className="w-12 h-12 mx-auto mb-3 rounded-full border-pink-200 border-t-pink-400 animate-spin"
                style={{ borderWidth: '3px' }}
              />
              <p className="text-xs text-gray-500">AI 正在生成美甲设计...</p>
            </div>
          </div>
        )}

        {imageUrl && (
          <div className="relative max-w-full max-h-full animate-fade-in">
            <img
              src={imageUrl}
              alt="AI 生成的美甲设计"
              className="max-w-full max-h-full object-contain rounded-2xl shadow-lg shadow-pink-200/30"
            />
          </div>
        )}
      </div>
    </div>
  );
}
