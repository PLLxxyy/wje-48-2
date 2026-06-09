import { useState } from 'react';
import { Download, FileText, FileJson, Calendar, Check, AlertCircle } from 'lucide-react';
import { useDreamStore } from '@/store/dreamStore';
import { GlassCard } from '@/components/GlassCard';
import { exportDreams } from '@/utils/export';
import { ExportFormat } from '@/types';
import { format as formatDate } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export default function Export() {
  const { dreams, series } = useDreamStore();
  const [exportFormat, setExportFormat] = useState<ExportFormat>('markdown');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const filteredDreams = dreams.filter((dream) => {
    if (startDate && new Date(dream.wakeUpTime) < new Date(startDate)) return false;
    if (endDate && new Date(dream.wakeUpTime) > new Date(endDate + 'T23:59:59')) return false;
    return true;
  });

  const handleExport = () => {
    if (filteredDreams.length === 0) return;

    setExporting(true);

    setTimeout(() => {
      exportDreams(dreams, series, {
        format: exportFormat,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });

      setExporting(false);
      setExportSuccess(true);

      setTimeout(() => {
        setExportSuccess(false);
      }, 3000);
    }, 500);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <h1 className="font-display text-3xl font-bold text-white mb-2">数据导出</h1>
        <p className="text-white/60">
          将你的梦境数据导出为文件，备份到本地。数据永不上传。
        </p>
      </div>

      {/* 隐私提示 */}
      <GlassCard className="p-5 mb-6 border-l-4 border-l-dream-accent animate-slide-up">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-dream-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white/80 font-medium mb-1">隐私保护</p>
            <p className="text-white/60 text-sm">
              所有梦境数据仅保存在你的浏览器本地，导出过程完全在本地完成，不会上传到任何服务器。
            </p>
          </div>
        </div>
      </GlassCard>

      {/* 统计信息 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <GlassCard className="p-4 text-center animate-stagger">
          <p className="text-3xl font-bold text-white">{dreams.length}</p>
          <p className="text-white/50 text-sm">总梦境数</p>
        </GlassCard>
        <GlassCard className="p-4 text-center animate-stagger">
          <p className="text-3xl font-bold text-dream-purpleSoft">{series.length}</p>
          <p className="text-white/50 text-sm">系列数</p>
        </GlassCard>
        <GlassCard className="p-4 text-center animate-stagger">
          <p className="text-3xl font-bold text-dream-blueSoft">
            {dreams.reduce((sum, d) => sum + d.sleepDuration, 0).toFixed(0)}
          </p>
          <p className="text-white/50 text-sm">总睡眠(h)</p>
        </GlassCard>
        <GlassCard className="p-4 text-center animate-stagger">
          <p className="text-3xl font-bold text-dream-pinkSoft">{filteredDreams.length}</p>
          <p className="text-white/50 text-sm">将导出</p>
        </GlassCard>
      </div>

      {/* 导出选项 */}
      <GlassCard className="p-6 mb-6 animate-slide-up">
        <h2 className="font-display text-xl font-semibold text-white mb-6">导出选项</h2>

        <div className="space-y-6">
          {/* 格式选择 */}
          <div>
            <label className="block text-white/80 font-medium mb-3">
              导出格式
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setExportFormat('markdown')}
                className={`p-5 rounded-xl border-2 transition-all ${
                  exportFormat === 'markdown'
                    ? 'border-dream-primary bg-dream-primary/20 shadow-glow'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <FileText
                  className={`w-10 h-10 mx-auto mb-3 ${
                    exportFormat === 'markdown' ? 'text-dream-primary' : 'text-white/50'
                  }`}
                />
                <p className="font-medium text-white mb-1">Markdown</p>
                <p className="text-xs text-white/50">
                  易读的文档格式，适合查看和分享
                </p>
              </button>

              <button
                onClick={() => setExportFormat('json')}
                className={`p-5 rounded-xl border-2 transition-all ${
                  exportFormat === 'json'
                    ? 'border-dream-primary bg-dream-primary/20 shadow-glow'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <FileJson
                  className={`w-10 h-10 mx-auto mb-3 ${
                    exportFormat === 'json' ? 'text-dream-primary' : 'text-white/50'
                  }`}
                />
                <p className="font-medium text-white mb-1">JSON</p>
                <p className="text-xs text-white/50">
                  结构化数据，适合导入其他应用
                </p>
              </button>
            </div>
          </div>

          {/* 日期范围 */}
          <div>
            <label className="flex items-center gap-2 text-white/80 font-medium mb-3">
              <Calendar className="w-4 h-4" />
              日期范围（可选）
            </label>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[160px]">
                <label className="text-white/50 text-sm mb-1 block">开始日期</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="flex-1 min-w-[160px]">
                <label className="text-white/50 text-sm mb-1 block">结束日期</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
                className="mt-3 text-sm text-dream-primary hover:text-dream-purpleSoft transition-colors"
              >
                清除日期范围
              </button>
            )}
          </div>
        </div>
      </GlassCard>

      {/* 导出预览 */}
      <GlassCard className="p-6 mb-6 animate-slide-up">
        <h2 className="font-display text-xl font-semibold text-white mb-4">导出预览</h2>
        <div className="bg-black/30 rounded-xl p-4 font-mono text-sm">
          <p className="text-white/60 mb-2">// 导出信息</p>
          <p className="text-dream-purpleSoft">
            格式: <span className="text-white">{exportFormat === 'markdown' ? 'Markdown' : 'JSON'}</span>
          </p>
          <p className="text-dream-purpleSoft">
            时间范围:{' '}
            <span className="text-white">
              {startDate
                ? formatDate(new Date(startDate), 'yyyy-MM-dd', { locale: zhCN })
                : '最早'}
              {' ~ '}
              {endDate
                ? formatDate(new Date(endDate), 'yyyy-MM-dd', { locale: zhCN })
                : '最新'}
            </span>
          </p>
          <p className="text-dream-purpleSoft">
            包含梦境: <span className="text-white">{filteredDreams.length} 个</span>
          </p>
          <p className="text-dream-purpleSoft">
            包含系列:{' '}
            <span className="text-white">
              {series.filter((s) =>
                s.dreamIds.some((id) => filteredDreams.some((d) => d.id === id))
              ).length}{' '}
              个
            </span>
          </p>
        </div>
      </GlassCard>

      {/* 导出按钮 */}
      <div className="flex justify-end">
        <button
          onClick={handleExport}
          disabled={filteredDreams.length === 0 || exporting}
          className={`btn-accent flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            exportSuccess ? 'bg-green-500' : ''
          }`}
        >
          {exportSuccess ? (
            <>
              <Check className="w-5 h-5" />
              导出成功！
            </>
          ) : (
            <>
              <Download className={`w-5 h-5 ${exporting ? 'animate-spin' : ''}`} />
              {exporting ? '导出中...' : `导出 ${filteredDreams.length} 个梦境`}
            </>
          )}
        </button>
      </div>

      {dreams.length === 0 && (
        <div className="text-center mt-8">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-white/50">还没有梦境数据可以导出</p>
        </div>
      )}
    </div>
  );
}
