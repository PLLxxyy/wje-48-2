import { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  PenSquare,
  BookOpen,
  BarChart3,
  GitBranch,
  Sparkles,
  Download,
  Moon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
}

const navItems: NavItem[] = [
  { to: '/', icon: Home, label: '首页' },
  { to: '/record', icon: PenSquare, label: '记录梦境' },
  { to: '/dreams', icon: BookOpen, label: '梦境列表' },
  { to: '/visualize', icon: BarChart3, label: '数据可视化' },
  { to: '/series', icon: GitBranch, label: '梦境系列' },
  { to: '/reverie', icon: Sparkles, label: '随机梦回' },
  { to: '/export', icon: Download, label: '数据导出' },
];

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex relative z-10">
      {/* 侧边导航 - 桌面端 */}
      <aside className="hidden lg:flex flex-col w-64 p-6 border-r border-white/10 bg-dream-bg/50 backdrop-blur-xl sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-dream-primary to-dream-secondary flex items-center justify-center shadow-glow">
            <Moon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-white">梦境日记</h1>
            <p className="text-xs text-white/50">Dream Diary</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  'nav-link',
                  isActive && 'active'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-white/10">
          <div className="glass-card p-4">
            <p className="text-xs text-white/50 mb-2">数据完全本地存储</p>
            <p className="text-xs text-white/40">您的梦境仅保存在此设备，永不上传</p>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 min-h-screen">
        {/* 顶部导航 - 移动端/平板 */}
        <header className="lg:hidden sticky top-0 z-50 bg-dream-bg/80 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-dream-primary to-dream-secondary flex items-center justify-center">
                <Moon className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-display text-lg font-bold text-white">梦境日记</h1>
            </div>
          </div>
        </header>

        {/* 内容 */}
        <div className="p-4 md:p-8 pb-24 lg:pb-8">{children}</div>

        {/* 底部导航 - 移动端 */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-dream-bg/95 backdrop-blur-xl border-t border-white/10 px-2 py-2 z-50">
          <div className="flex justify-around">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all',
                    isActive
                      ? 'text-dream-primary'
                      : 'text-white/50 hover:text-white'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      </main>
    </div>
  );
};
