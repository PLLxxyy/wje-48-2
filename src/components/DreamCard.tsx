import { useState } from 'react';
import { Clock, Moon, ChevronDown, ChevronUp, Edit2, Trash2, Link2, Star } from 'lucide-react';
import { Dream } from '@/types';
import { GlassCard } from './GlassCard';
import { EmotionTag } from './EmotionTag';
import { formatDateTime, formatSleepDuration } from '@/utils/date';
import { highlightText } from '@/utils/wordAnalysis';
import { cn } from '@/lib/utils';

interface DreamCardProps {
  dream: Dream;
  searchKeyword?: string;
  onEdit?: (dream: Dream) => void;
  onDelete?: (id: string) => void;
  onAddToSeries?: (dream: Dream) => void;
  onToggleFavorite?: (id: string) => void;
  className?: string;
}

export const DreamCard = ({
  dream,
  searchKeyword = '',
  onEdit,
  onDelete,
  onAddToSeries,
  onToggleFavorite,
  className,
}: DreamCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderHighlightedText = (text: string) => {
    if (!searchKeyword.trim()) {
      return text;
    }

    const highlighted = highlightText(text, searchKeyword);
    const parts = highlighted.split(/\|\|\|HIGHLIGHT\|\|\|/);

    return parts.map((part, index) => {
      const endMarkerIndex = part.indexOf('|||/HIGHLIGHT|||');
      if (endMarkerIndex !== -1) {
        const keywordText = part.substring(0, endMarkerIndex);
        const remainingText = part.substring(endMarkerIndex + '|||/HIGHLIGHT|||'.length);
        return (
          <span key={index}>
            <mark className="highlight-text">{keywordText}</mark>
            {remainingText}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const summary = dream.content.substring(0, 100) + (dream.content.length > 100 ? '...' : '');

  return (
    <GlassCard hover className={cn('overflow-hidden animate-stagger', className)}>
      <div
        className="p-5 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="font-display text-xl font-semibold text-white flex-1">
            {renderHighlightedText(dream.title)}
          </h3>
          <div className="flex items-center gap-1">
            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(dream.id);
                }}
                className={`transition-colors p-1 ${
                  dream.isFavorite
                    ? 'text-yellow-400 hover:text-yellow-300'
                    : 'text-white/50 hover:text-yellow-400'
                }`}
              >
                <Star className={`w-5 h-5 ${dream.isFavorite ? 'fill-current' : ''}`} />
              </button>
            )}
            <button className="text-white/50 hover:text-white transition-colors p-1">
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-3 text-sm text-white/60">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {formatDateTime(dream.wakeUpTime)}
          </span>
          <span className="flex items-center gap-1.5">
            <Moon className="w-4 h-4" />
            {formatSleepDuration(dream.sleepDuration)}
          </span>
          <EmotionTag emotion={dream.emotion} size="sm" />
        </div>

        <div className="text-white/80 leading-relaxed">
          {isExpanded ? renderHighlightedText(dream.content) : renderHighlightedText(summary)}
        </div>

        {dream.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {dream.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-dream-primary/15 text-dream-purpleSoft text-xs rounded-full border border-dream-primary/20"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {isExpanded && (onEdit || onDelete || onAddToSeries || onToggleFavorite) && (
        <div className="px-5 py-3 border-t border-white/10 bg-white/5 flex items-center justify-between gap-2">
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(dream.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-all ${
                dream.isFavorite
                  ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10'
                  : 'text-white/70 hover:text-yellow-400 hover:bg-white/10'
              }`}
            >
              <Star className={`w-4 h-4 ${dream.isFavorite ? 'fill-current' : ''}`} />
              {dream.isFavorite ? '取消收藏' : '收藏'}
            </button>
          )}
          <div className="flex items-center gap-2">
            {onAddToSeries && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToSeries(dream);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <Link2 className="w-4 h-4" />
                加入系列
              </button>
            )}
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(dream);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <Edit2 className="w-4 h-4" />
                编辑
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(dream.id);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
                删除
              </button>
            )}
          </div>
        </div>
      )}
    </GlassCard>
  );
};
