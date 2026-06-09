import { EmotionType, EMOTION_LABELS, EMOTION_EMOJIS } from '@/types';
import { cn } from '@/lib/utils';

interface EmotionTagProps {
  emotion: EmotionType;
  showEmoji?: boolean;
  showLabel?: boolean;
  size?: 'sm' | 'md';
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

const emotionColors: Record<EmotionType, string> = {
  happy: 'bg-emotion-happy/20 text-emotion-happy border-emotion-happy/30',
  sad: 'bg-emotion-sad/20 text-emotion-sad border-emotion-sad/30',
  fear: 'bg-emotion-fear/20 text-emotion-fear border-emotion-fear/30',
  calm: 'bg-emotion-calm/20 text-emotion-calm border-emotion-calm/30',
  excited: 'bg-emotion-excited/20 text-emotion-excited border-emotion-excited/30',
  confused: 'bg-emotion-confused/20 text-emotion-confused border-emotion-confused/30',
  angry: 'bg-emotion-angry/20 text-emotion-angry border-emotion-angry/30',
  peaceful: 'bg-emotion-peaceful/20 text-emotion-peaceful border-emotion-peaceful/30',
};

const selectedColors: Record<EmotionType, string> = {
  happy: 'bg-emotion-happy/40 text-white border-emotion-happy',
  sad: 'bg-emotion-sad/40 text-white border-emotion-sad',
  fear: 'bg-emotion-fear/40 text-white border-emotion-fear',
  calm: 'bg-emotion-calm/40 text-white border-emotion-calm',
  excited: 'bg-emotion-excited/40 text-white border-emotion-excited',
  confused: 'bg-emotion-confused/40 text-white border-emotion-confused',
  angry: 'bg-emotion-angry/40 text-white border-emotion-angry',
  peaceful: 'bg-emotion-peaceful/40 text-white border-emotion-peaceful',
};

export const EmotionTag = ({
  emotion,
  showEmoji = true,
  showLabel = true,
  size = 'md',
  onClick,
  selected = false,
  className,
}: EmotionTagProps) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border backdrop-blur-sm font-medium transition-all duration-300',
        selected ? selectedColors[emotion] : emotionColors[emotion],
        sizeClasses,
        onClick && 'cursor-pointer hover:scale-105',
        className
      )}
      onClick={onClick}
    >
      {showEmoji && <span>{EMOTION_EMOJIS[emotion]}</span>}
      {showLabel && <span>{EMOTION_LABELS[emotion]}</span>}
    </span>
  );
};
