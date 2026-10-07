import { Hand, Sparkles, Upload, Palette, Heart, Trophy } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="min-h-screen nail-gradient flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-pink-200/20 blur-3xl" />
      <div className="absolute bottom-20 right-16 w-56 h-56 rounded-full bg-rose-200/20 blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-pink-100/30 blur-2xl" />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-300 to-rose-300 flex items-center justify-center shadow-lg shadow-pink-200/50">
            <Hand className="w-6 h-6 text-white" strokeWidth={2.2} />
          </div>
          <span className="text-xl font-semibold text-gray-700 tracking-wide">
            NailAI Studio
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3 leading-tight">
          AI 美甲设计工具
        </h1>
        <p className="text-base text-gray-500 mb-6 max-w-md mx-auto leading-relaxed">
          上传你喜欢的素材图片，AI 为你生成专属美甲设计方案
          <br />
          配色、花纹、施工清单，一站搞定
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/50 text-xs text-gray-500">
            <Palette className="w-3.5 h-3.5 text-pink-400" /> 智能配色提取
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/50 text-xs text-gray-500">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" /> 一键生成设计
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/50 text-xs text-gray-500">
            <Heart className="w-3.5 h-3.5 text-rose-400" /> 痛甲定制设计
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/50 text-xs text-gray-500">
            <Trophy className="w-3.5 h-3.5 text-amber-400" /> 应援甲应援色搭配
          </span>
        </div>

        <button
          onClick={onEnter}
          className="group relative inline-flex items-center gap-3 px-8 py-5 rounded-2xl bg-gradient-to-r from-pink-300 to-rose-300 text-white font-medium text-lg shadow-xl shadow-pink-200/40 hover:shadow-pink-300/50 hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          <Upload className="w-5 h-5 group-hover:animate-bounce" />
          <span>可以点击这里上传你喜欢的素材图</span>
          <div className="absolute inset-0 rounded-2xl animate-shimmer pointer-events-none" />
        </button>

        <p className="text-xs text-gray-400 mt-6">
          点击上方文字，进入设计工作台
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-6 h-8 rounded-full bg-gradient-to-b from-pink-200/60 to-rose-200/40 animate-float"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      <div className="absolute top-8 right-8 hidden md:flex flex-col gap-2">
        <div className="w-12 h-16 rounded-t-full rounded-b-lg bg-gradient-to-b from-pink-200 to-rose-200 opacity-30 rotate-12" />
      </div>
      <div className="absolute bottom-32 left-12 hidden md:block">
        <div className="w-10 h-14 rounded-t-full rounded-b-lg bg-gradient-to-b from-rose-200 to-pink-200 opacity-25 -rotate-12" />
      </div>
    </div>
  );
}
