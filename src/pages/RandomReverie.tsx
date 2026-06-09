import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, RefreshCw, BookOpen } from 'lucide-react';
import { useDreamStore } from '@/store/dreamStore';
import { GlassCard } from '@/components/GlassCard';
import { EmotionTag } from '@/components/EmotionTag';
import { formatDateTime } from '@/utils/date';

export default function RandomReverie() {
  const navigate = useNavigate();
  const { dreams, getRandomDreamFragment } = useDreamStore();
  const [currentFragment, setCurrentFragment] = useState<{
    dream: typeof dreams[0];
    fragment: string;
  } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showFullDream, setShowFullDream] = useState(false);

  const getNewFragment = () => {
    setIsAnimating(true);
    setShowFullDream(false);

    setTimeout(() => {
      const fragment = getRandomDreamFragment();
      setCurrentFragment(fragment);
      setIsAnimating(false);
    }, 800);
  };

  useEffect(() => {
    if (dreams.length > 0 && !currentFragment) {
      getNewFragment();
    }
  }, [dreams.length]);

  if (dreams.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <GlassCard className="p-12 text-center animate-fade-in">
          <div className="text-6xl mb-4">✨</div>
          <p className="text-white/60 mb-4">还没有记录任何梦境</p>
          <p className="text-white/40 text-sm mb-6">
            先记录一些梦境，再来体验随机梦回吧
          </p>
          <button onClick={() => navigate('/record')} className="btn-primary">
            记录第一个梦境
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-block mb-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-dream-primary to-dream-secondary flex items-center justify-center shadow-glow animate-float">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="font-display text-4xl font-bold text-white mb-3">
          随机梦回
        </h1>
        <p className="text-white/60 text-lg">
          从潜意识深处抽出一个梦境片段，重温那段奇幻时光
        </p>
      </div>

      <div className="relative">
        {/* 神秘光晕 */}
        <div className="absolute -inset-4 bg-gradient-to-r from-dream-primary/20 via-dream-secondary/20 to-dream-purpleSoft/20 rounded-3xl blur-2xl animate-pulse-slow" />

        <GlassCard
          className={`p-8 md:p-12 relative overflow-hidden transition-all duration-700 ${
            isAnimating ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'
          }`}
        >
          {/* 装饰性边框 */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-dream-primary/30 via-dream-secondary/30 to-dream-purpleSoft/30 p-[2px] animate-shimmer" style={{ backgroundSize: '200% 100%' }}>
            <div className="w-full h-full bg-dream-bgLight/95 rounded-[14px]" />
          </div>

          <div className="relative z-10">
            {currentFragment && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-white mb-2">
                      {currentFragment.dream.title}
                    </h2>
                    <p className="text-white/50 text-sm">
                      {formatDateTime(currentFragment.dream.wakeUpTime)}
                    </p>
                  </div>
                  <EmotionTag
                    emotion={currentFragment.dream.emotion}
                    size="sm"
                  />
                </div>

                {!showFullDream ? (
                  <div className="mb-8">
                    <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-light italic">
                      "{currentFragment.fragment}"
                    </p>
                  </div>
                ) : (
                  <div className="mb-8 max-h-64 overflow-y-auto scrollbar-thin">
                    <p className="text-white/80 leading-relaxed">
                      {currentFragment.dream.content}
                    </p>
                  </div>
                )}

                {currentFragment.dream.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {currentFragment.dream.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-dream-primary/15 text-dream-purpleSoft text-sm rounded-full border border-dream-primary/20"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  {!showFullDream && (
                    <button
                      onClick={() => setShowFullDream(true)}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <BookOpen className="w-5 h-5" />
                      查看完整梦境
                    </button>
                  )}
                  <button
                    onClick={getNewFragment}
                    disabled={isAnimating}
                    className="btn-accent flex items-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`w-5 h-5 ${isAnimating ? 'animate-spin' : ''}`}
                    />
                    再抽一次
                  </button>
                </div>
              </>
            )}
          </div>
        </GlassCard>
      </div>

      {/* 提示文字 */}
      <div className="text-center mt-8 text-white/40 text-sm animate-pulse-slow">
        <p>💡 每次抽取都是随机的，也许会有意外的发现</p>
      </div>
    </div>
  );
}
