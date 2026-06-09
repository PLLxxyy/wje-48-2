import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, GitBranch, Plus, X, Trash2 } from 'lucide-react';
import { useDreamStore } from '@/store/dreamStore';
import { GlassCard } from '@/components/GlassCard';
import { DreamCard } from '@/components/DreamCard';
import { formatDate } from '@/utils/date';

export default function SeriesDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getSeriesById,
    dreams,
    updateSeries,
    removeDreamFromSeries,
    addDreamToSeries,
    deleteDream,
  } = useDreamStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const series = getSeriesById(id || '');

  if (!series) {
    return (
      <div className="max-w-4xl mx-auto">
        <GlassCard className="p-12 text-center animate-fade-in">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-white/60 mb-4">找不到这个系列</p>
          <button onClick={() => navigate('/series')} className="btn-primary">
            返回系列列表
          </button>
        </GlassCard>
      </div>
    );
  }

  const seriesDreams = dreams
    .filter((d) => series.dreamIds.includes(d.id) && d.seriesId === series.id)
    .sort((a, b) => new Date(b.wakeUpTime).getTime() - new Date(a.wakeUpTime).getTime());

  const availableDreams = dreams.filter((d) => d.seriesId !== series.id);

  const getDreamSeriesName = (dream: typeof dreams[0]) => {
    if (!dream.seriesId) return null;
    const s = getSeriesById(dream.seriesId);
    return s?.name || null;
  };

  const handleEdit = () => {
    setName(series.name);
    setDescription(series.description);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    updateSeries(series.id, {
      name: name.trim(),
      description: description.trim(),
    });
    setIsEditing(false);
  };

  const handleRemoveDream = (dreamId: string) => {
    if (window.confirm('确定要把这个梦境移出系列吗？')) {
      removeDreamFromSeries(series.id, dreamId);
    }
  };

  const handleAddDream = (dreamId: string) => {
    const dream = dreams.find((d) => d.id === dreamId);
    if (dream?.seriesId && dream.seriesId !== series.id) {
      const oldSeries = getSeriesById(dream.seriesId);
      const confirmMsg = `这个梦境当前属于「${oldSeries?.name || '未知系列'}」，将移动到当前系列。确定继续？`;
      if (!window.confirm(confirmMsg)) return;
    }
    addDreamToSeries(series.id, dreamId);
    setShowAddModal(false);
  };

  const handleEditDream = (dream: typeof dreams[0]) => {
    navigate(`/record/${dream.id}`);
  };

  const handleDeleteDream = (dreamId: string) => {
    if (window.confirm('确定要删除这个梦境吗？')) {
      deleteDream(dreamId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/series')}
        className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors animate-fade-in"
      >
        <ArrowLeft className="w-5 h-5" />
        返回系列列表
      </button>

      <GlassCard className="p-6 mb-8 animate-slide-up">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-dream-primary to-dream-secondary flex items-center justify-center shadow-glow">
              <GitBranch className="w-8 h-8 text-white" />
            </div>
            {isEditing ? (
              <div className="flex-1">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field font-display text-2xl font-bold mb-2"
                  placeholder="系列名称"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field"
                  placeholder="系列描述"
                  rows={2}
                />
                <div className="flex gap-2 mt-3">
                  <button onClick={handleSave} className="btn-accent py-2 px-4 text-sm">
                    保存
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary py-2 px-4 text-sm"
                  >
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="font-display text-3xl font-bold text-white mb-2">
                  {series.name}
                </h1>
                {series.description && (
                  <p className="text-white/60">{series.description}</p>
                )}
                <p className="text-white/40 text-sm mt-2">
                  包含 {seriesDreams.length} 个梦境
                </p>
              </div>
            )}
          </div>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}
        </div>
      </GlassCard>

      {/* 时间线 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-white">梦境时间线</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-secondary flex items-center gap-2 py-2 px-4 text-sm"
          >
            <Plus className="w-4 h-4" />
            添加梦境
          </button>
        </div>

        {seriesDreams.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <div className="text-4xl mb-3">💭</div>
            <p className="text-white/60 mb-4">这个系列还没有梦境</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary py-2 px-4 text-sm"
            >
              添加第一个梦境
            </button>
          </GlassCard>
        ) : (
          <div className="relative">
            {/* 时间线 */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-dream-primary via-dream-secondary to-transparent" />

            <div className="space-y-6">
              {seriesDreams.map((dream, index) => (
                <div key={dream.id} className="relative pl-16 animate-stagger group">
                  {/* 时间点 */}
                  <div className="absolute left-4 top-6 w-5 h-5 rounded-full bg-dream-primary border-4 border-dream-bg shadow-glow" />

                  {/* 日期标签 */}
                  <div className="absolute left-0 top-0 w-14 text-center">
                    <p className="text-xs text-white/50">
                      {formatDate(dream.wakeUpTime).substring(5)}
                    </p>
                  </div>

                  <DreamCard
                    dream={dream}
                    onEdit={handleEditDream}
                    onDelete={handleDeleteDream}
                  />

                  {/* 移出按钮 */}
                  <button
                    onClick={() => handleRemoveDream(dream.id)}
                    className="absolute right-2 top-2 p-2 text-red-400/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="移出系列"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 添加梦境弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <GlassCard className="p-6 w-full max-w-lg animate-slide-up max-h-[80vh] overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-white">
                添加梦境到系列
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {availableDreams.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">😕</div>
                <p className="text-white/60">没有可用的梦境可以添加</p>
                <p className="text-white/40 text-sm mt-1">所有梦境都已在这个系列中</p>
              </div>
            ) : (
              <div className="space-y-2">
                {availableDreams.map((dream) => {
                  const currentSeries = getDreamSeriesName(dream);
                  return (
                    <div
                      key={dream.id}
                      onClick={() => handleAddDream(dream.id)}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">{dream.title}</p>
                          <p className="text-sm text-white/50">
                            {formatDate(dream.wakeUpTime)}
                            {currentSeries && (
                              <span className="ml-2 text-dream-accent">
                                · 属于「{currentSeries}」
                              </span>
                            )}
                          </p>
                        </div>
                        <Plus className="w-5 h-5 text-dream-primary" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="btn-secondary flex-1"
              >
                关闭
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
