import { ReactNode, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

export const GlassCard = ({ children, className, hover = false, onClick, style }: GlassCardProps) => {
  return (
    <div
      className={cn(
        hover ? 'glass-card-hover' : 'glass-card',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};
