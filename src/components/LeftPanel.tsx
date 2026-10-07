'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Image, Sparkles, X, Search, Wand2 } from 'lucide-react';

interface LeftPanelProps {
  uploadedImages: string[];
  onImagesChange: (images: string[]) => void;
  instruction: string;
  onInstructionChange: (instruction: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  materialLibrary: { id: string; name: string; category: string; image_url: string; description: string }[];
}

export default function LeftPanel({
  uploadedImages,
  onImagesChange,
  instruction,
  onInstructionChange,
  onGenerate,
  isGenerating,
  materialLibrary,
}: LeftPanelProps) {
  const [dragOver, setDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'library'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList) => {
    const newImages: string[] = [];
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        newImages.push(reader.result as string);
        if (newImages.length === files.length) {
          onImagesChange([...uploadedImages, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  }, [uploadedImages, onImagesChange]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (idx: number) => {
    onImagesChange(uploadedImages.filter((_, i) => i !== idx));
  };

  const addLibraryImage = (item: typeof materialLibrary[0]) => {
    if (!uploadedImages.includes(item.image_url)) {
      onImagesChange([...uploadedImages, item.image_url]);
    }
  };

  const categories = [...new Set(materialLibrary.map((m) => m.category))];

  return (
    <div className="h-full flex flex-col bg-white/60 backdrop-blur-sm">
      <div className="px-4 py-3 border-b border-pink-100">
        <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Image className="w-4 h-4 text-pink-400" />
          素材上传区
        </h2>
      </div>

      <div className="flex border-b border-pink-100 px-4 pt-2">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-3 py-2 text-xs font-medium rounded-t-lg transition-colors ${
            activeTab === 'upload'
              ? 'text-pink-500 border-b-2 border-pink-400 bg-pink-50/50'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          上传图片
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`px-3 py-2 text-xs font-medium rounded-t-lg transition-colors ${
            activeTab === 'library'
              ? 'text-pink-500 border-b-2 border-pink-400 bg-pink-50/50'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          素材库
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        {activeTab === 'upload' && (
          <div className="space-y-3">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-pink-400 bg-pink-50'
                  : 'border-pink-200 hover:border-pink-300 hover:bg-pink-50/50'
              }`}
            >
              <Upload className="w-7 h-7 text-pink-300 mx-auto mb-2" />
              <p className="text-xs text-gray-500 font-medium">点击或拖拽上传</p>
              <p className="text-[10px] text-gray-400 mt-1">支持多张图片</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
              />
            </div>

            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {uploadedImages.map((img, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden aspect-square">
                    <img src={img} alt={`素材 ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 text-[9px] px-1.5 py-0.5 rounded bg-pink-400 text-white">
                        主素材
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'library' && (
          <div className="space-y-3">
            {categories.map((cat) => (
              <div key={cat}>
                <p className="text-[10px] font-medium text-gray-400 mb-1.5 flex items-center gap-1">
                  <Search className="w-3 h-3" /> {cat}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {materialLibrary.filter((m) => m.category === cat).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => addLibraryImage(item)}
                      className="group relative rounded-lg overflow-hidden aspect-square border-2 border-transparent hover:border-pink-300 transition-all"
                    >
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                        <span className="text-[9px] text-white font-medium">{item.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {materialLibrary.length === 0 && (
              <div className="text-center py-8">
                <Image className="w-8 h-8 text-pink-200 mx-auto mb-2" />
                <p className="text-xs text-gray-400">素材库加载中...</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-pink-100 p-3 space-y-2">
        <textarea
          value={instruction}
          onChange={(e) => onInstructionChange(e.target.value)}
          placeholder="输入设计指令，如：花朵渐变风、法式爱心、闪粉猫眼..."
          className="w-full text-xs text-gray-600 placeholder-gray-300 rounded-xl border border-pink-100 bg-white/70 p-2.5 resize-none focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-200 transition-all"
          rows={2}
        />
        <button
          onClick={onGenerate}
          disabled={isGenerating || uploadedImages.length === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-300 to-rose-300 text-white text-sm font-medium shadow-md shadow-pink-200/40 hover:shadow-pink-300/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <Wand2 className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? '生成中...' : '生成美甲设计'}
        </button>
      </div>
    </div>
  );
}
