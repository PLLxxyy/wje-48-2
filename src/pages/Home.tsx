import { useNavigate } from 'react-router-dom';
import { PenSquare, BookOpen, BarChart3, Sparkles, GitBranch, Download, Star } from 'lucide-react';
import { useDreamStore } from '@/store/dreamStore';
import { GlassCard } from '@/components/GlassCard';
import { EmotionTag } from '@/components/EmotionTag';
import { formatDateTime } from '@/utils/date';
import { cn } from '@/lib/utils';

interface QuickAction {
  icon: React.ElementType;
  label: string;
  to: string;
  color: string;
}

const quickActions: QuickAction[] = [
  { icon: PenSquare, label: '记录梦境', to: '/record', color: 'from-dream-primary to-dream-secondary' },
  { icon: BookOpen, label: '查看梦境', to: '/dreams', color: 'from-blue-500 to-cyan-500' },
  { icon: Star, label: '我的收藏', to: '/dreams?favorite=1', color: 'from-yellow-400 to-amber-500' },
  { icon: BarChart3, label: '数据可视化', to: '/visualize', color: 'from-green-500 to-emerald-500' },
  { icon: Sparkles, label: '随机梦回', to: '/reverie', color: 'from-orange-500 to-red-500' },
  { icon: GitBranch, label: '梦境系列', to: '/series', color: 'from-pink-500 to-rose-500' },
  { icon: Download, label: '导出备份', to: '/export', color: 'from-purple-500 to-violet-500' },
];

export default function Home() {
  const navigate = useNavigate();
  const { dreams, series, getFavoriteDreams, setSearchFilters } = useDreamStore();
  const favoriteDreams = getFavoriteDreams();

  const recentDreams = [...dreams]
    .sort((a, b) => new Date(b.wakeUpTime).getTime() - new Date(a.wakeUpTime).getTime())
    .slice(0, 3);

  const totalSleepHours = dreams.reduce((sum, d) => sum + d.sleepDuration, 0);
  const avgSleepHours = dreams.length > 0 ? (totalSleepHours / dreams.length).toFixed(1) : '0';

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="mb-12 text-center animate-fade-in">
        <div className="inline-block mb-4">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-dream-primary to-dream-secondary flex items-center justify-center shadow-glow animate-float">
            <span className="text-4xl">🌙</span>
          </div>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
          欢迎回到<span className="bg-gradient-to-r from-dream-accent to-dream-accentSoft bg-clip-text text-transparent"> 梦境世界</span>
        </h1>
        <p className="text-white/60 text-lg max-w-xl mx-auto">
          记录每一个奇幻的梦境，探索你的潜意识深处，发现隐藏的自己
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-12">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <GlassCard
              key={action.to}
              hover
              className="p-5 text-center cursor-pointer animate-stagger"
              onClick={() => navigate(action.to)}
            >
              <div
                className={cn(
                  'w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br flex items-center justify-center',
                  action.color
                )}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-medium text-sm">{action.label}</span>
            </GlassCard>
          );
        })}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
        <GlassCard className="p-6 animate-stagger cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/dreams')}>
          <p className="text-white/50 text-sm mb-1">梦境总数</p>
          <p className="font-display text-3xl font-bold text-white">{dreams.length}</p>
        </GlassCard>
        <GlassCard className="p-6 animate-stagger cursor-pointer hover:scale-105 transition-transform" onClick={() => {
          setSearchFilters({ isFavorite: true });
          navigate('/dreams');
        }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
            <p className="text-white/50 text-sm">收藏梦境</p>
          </div>
          <p className="font-display text-3xl font-bold text-yellow-400">{favoriteDreams.length}</p>
        </GlassCard>
        <GlassCard className="p-6 animate-stagger cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/series')}>
          <p className="text-white/50 text-sm mb-1">系列数量</p>
          <p className="font-display text-3xl font-bold text-dream-purpleSoft">{series.length}</p>
        </GlassCard>
        <GlassCard className="p-6 animate-stagger">
          <p className="text-white/50 text-sm mb-1">平均睡眠</p>
          <p className="font-display text-3xl font-bold text-dream-blueSoft">{avgSleepHours}h</p>
        </GlassCard>
        <GlassCard className="p-6 animate-stagger">
          <p className="text-white/50 text-sm mb-1">总睡眠时长</p>
          <p className="font-display text-3xl font-bold text-dream-pinkSoft">{totalSleepHours.toFixed(0)}h</p>
        </GlassCard>
      </div>

      {/* Recent Dreams */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-white">最近的梦境</h2>
          <button
            onClick={() => navigate('/dreams')}
            className="text-dream-primary hover:text-dream-purpleSoft transition-colors text-sm font-medium"
          >
            查看全部 →
          </button>
        </div>

        {recentDreams.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <div className="text-6xl mb-4">💭</div>
            <p className="text-white/60 mb-4">还没有记录任何梦境</p>
            <button onClick={() => navigate('/record')} className="btn-primary">
              记录第一个梦境
            </button>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentDreams.map((dream) => (
              <GlassCard
                key={dream.id}
                hover
                className="p-5 cursor-pointer animate-stagger"
                onClick={() => navigate(`/dreams`)}
              >
                <h3 className="font-display text-lg font-semibold text-white mb-2">
                  {dream.title}
                </h3>
                <p className="text-white/60 text-sm mb-3">{formatDateTime(dream.wakeUpTime)}</p>
                <p className="text-white/70 text-sm line-clamp-2 mb-3">
                  {dream.content.substring(0, 80)}...
                </p>
                <EmotionTag emotion={dream.emotion} size="sm" />
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
