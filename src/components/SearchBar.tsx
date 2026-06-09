import { Search, Filter, X, Calendar, Star } from 'lucide-react';
import { EmotionType } from '@/types';
import { EmotionTag } from './EmotionTag';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  emotion?: EmotionType;
  onEmotionChange: (value?: EmotionType) => void;
  startDate?: string;
  onStartDateChange: (value?: string) => void;
  endDate?: string;
  onEndDateChange: (value?: string) => void;
  isFavorite?: boolean;
  onIsFavoriteChange: (value?: boolean) => void;
  onReset: () => void;
  className?: string;
}

export const SearchBar = ({
  keyword,
  onKeywordChange,
  emotion,
  onEmotionChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  isFavorite,
  onIsFavoriteChange,
  onReset,
  className,
}: SearchBarProps) => {
  const hasFilters = keyword || emotion || startDate || endDate || isFavorite !== undefined;
  const emotions: EmotionType[] = ['happy', 'sad', 'fear', 'calm', 'excited', 'confused', 'angry', 'peaceful'];

  return (
    <div className={cn('w-full', className)}>
      <div className="glass-card p-4 mb-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="搜索梦境标题、内容或标签..."
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              className="input-field pl-12 pr-10"
            />
            {keyword && (
              <button
                onClick={() => onKeywordChange('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="date"
                value={startDate || ''}
                onChange={(e) => onStartDateChange(e.target.value || undefined)}
                className="input-field pl-10 pr-3 w-[140px]"
              />
            </div>
            <span className="flex items-center text-white/40">至</span>
            <div className="relative">
              <input
                type="date"
                value={endDate || ''}
                onChange={(e) => onEndDateChange(e.target.value || undefined)}
                className="input-field px-3 w-[140px]"
              />
            </div>
            {hasFilters && (
              <button onClick={onReset} className="btn-secondary flex items-center gap-2">
                <X className="w-4 h-4" />
                重置
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <Filter className="w-4 h-4 text-white/50" />
                <span className="text-sm text-white/50">按情绪筛选</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {emotions.map((e) => (
                  <EmotionTag
                    key={e}
                    emotion={e}
                    size="sm"
                    selected={emotion === e}
                    onClick={() => onEmotionChange(emotion === e ? undefined : e)}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <Star className="w-4 h-4 text-white/50" />
                <span className="text-sm text-white/50">按收藏筛选</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onIsFavoriteChange(isFavorite === true ? undefined : true)}
                  className={`px-4 py-2 rounded-xl text-sm transition-all flex items-center gap-1.5 ${
                    isFavorite === true
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Star className={`w-4 h-4 ${isFavorite === true ? 'fill-current' : ''}`} />
                  已收藏
                </button>
                <button
                  onClick={() => onIsFavoriteChange(isFavorite === false ? undefined : false)}
                  className={`px-4 py-2 rounded-xl text-sm transition-all flex items-center gap-1.5 ${
                    isFavorite === false
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Star className="w-4 h-4" />
                  未收藏
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
