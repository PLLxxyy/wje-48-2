import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, GitBranch, Edit2, Trash2, X, ChevronRight } from 'lucide-react';
import { useDreamStore } from '@/store/dreamStore';
import { GlassCard } from '@/components/GlassCard';
import { EmotionTag } from '@/components/EmotionTag';
import { formatDate } from '@/utils/date';

export default function SeriesList() {
  const navigate = useNavigate();
  const { series, dreams, addSeries, deleteSeries } = useDreamStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDreams, setSelectedDreams] = useState<string[]>([]);

  const handleCreateSeries = () => {
    if (!name.trim()) return;

    const dreamsFromOtherSeries = selectedDreams.filter(
      (id) => dreams.find((d) => d.id === id)?.seriesId
    );

    if (dreamsFromOtherSeries.length > 0) {
      const dreamTitles = dreamsFromOtherSeries
        .map((id) => dreams.find((d) => d.id === id)?.title)
        .join('、');
      const confirmMsg = `选中的梦境中有 ${dreamsFromOtherSeries.length} 个（${dreamTitles}）属于其他系列，将移动到新系列。确定继续？`;
      if (!window.confirm(confirmMsg)) return;
    }

    addSeries({
      name: name.trim(),
      description: description.trim(),
      dreamIds: selectedDreams,
    });

    setShowCreateModal(false);
    setName('');
    setDescription('');
    setSelectedDreams([]);
  };

  const handleDeleteSeries = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这个系列吗？系列中的梦境不会被删除。')) {
      deleteSeries(id);
    }
  };

  const toggleDreamSelection = (dreamId: string) => {
    setSelectedDreams((prev) =>
      prev.includes(dreamId)
        ? prev.filter((id) => id !== dreamId)
        : [...prev, dreamId]
    );
  };

  const getSeriesDreams = (seriesId: string, dreamIds: string[]) => {
    return dreams
      .filter((d) => dreamIds.includes(d.id) && d.seriesId === seriesId)
      .sort((a, b) => new Date(b.wakeUpTime).getTime() - new Date(a.wakeUpTime).getTime());
  };

  const sortedSeries = [...series].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">梦境系列</h1>
          <p className="text-white/60">
            把有关联的梦境连接起来，探索它们之间的联系
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          创建系列
        </button>
      </div>

      {sortedSeries.length === 0 ? (
        <GlassCard className="p-12 text-center animate-fade-in">
          <div className="text-6xl mb-4">🔗</div>
          <p className="text-white/60 mb-4">还没有创建任何梦境系列</p>
          <p className="text-white/40 text-sm mb-6">
            系列可以帮助你把有关联的梦境组织在一起，发现隐藏的故事线
          </p>
          <button onClick={() => setShowCreateModal(true)} className="btn-primary">
            创建第一个系列
          </button>
        </GlassCard>
      ) : (
        <div className="space-y-6">
          {sortedSeries.map((s, index) => {
            const seriesDreams = getSeriesDreams(s.id, s.dreamIds);
            return (
              <GlassCard
                key={s.id}
                hover
                className="p-6 cursor-pointer animate-stagger"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate(`/series/${s.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-dream-primary to-dream-secondary flex items-center justify-center">
                      <GitBranch className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-white">
                        {s.name}
                      </h3>
                      <p className="text-white/50 text-sm">
                        {seriesDreams.length} 个梦境
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/series/${s.id}`);
                      }}
                      className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteSeries(s.id, e)}
                      className="p-2 text-red-400/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-5 h-5 text-white/30" />
                  </div>
                </div>

                {s.description && (
                  <p className="text-white/70 mb-4">{s.description}</p>
                )}

                {seriesDreams.length > 0 && (
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {seriesDreams.slice(0, 4).map((dream) => (
                        <div
                          key={dream.id}
                          className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg"
                        >
                          <span className="text-white/80 text-sm truncate max-w-[120px]">
                            {dream.title}
                          </span>
                          <EmotionTag
                            emotion={dream.emotion}
                            size="sm"
                            showLabel={false}
                          />
                        </div>
                      ))}
                      {seriesDreams.length > 4 && (
                        <span className="text-white/50 text-sm">
                          +{seriesDreams.length - 4} 更多
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* 创建系列弹窗 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <GlassCard className="p-6 w-full max-w-lg animate-slide-up max-h-[90vh] overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-white">
                创建新系列
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white/80 font-medium mb-2">
                  系列名称
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="给这个系列起个名字..."
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-white/80 font-medium mb-2">
                  系列描述
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="描述一下这个系列的主题..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>

              <div>
                <label className="block text-white/80 font-medium mb-3">
                  选择梦境（{selectedDreams.length} 个已选）
                </label>
                {selectedDreams.filter((id) => dreams.find((d) => d.id === id)?.seriesId).length > 0 && (
                  <p className="text-sm text-dream-accent mb-3">
                    ⚠️ 选中的部分梦境属于其他系列，创建后将移动到新系列
                  </p>
                )}
                <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin">
                  {dreams
                    .sort(
                      (a, b) =>
                        new Date(b.wakeUpTime).getTime() -
                        new Date(a.wakeUpTime).getTime()
                    )
                    .map((dream) => {
                      const currentSeries = dream.seriesId
                        ? series.find((s) => s.id === dream.seriesId)?.name
                        : null;
                      return (
                        <div
                          key={dream.id}
                          onClick={() => toggleDreamSelection(dream.id)}
                          className={`p-4 rounded-xl cursor-pointer transition-all ${
                            selectedDreams.includes(dream.id)
                              ? 'bg-dream-primary/20 border border-dream-primary/40'
                              : 'bg-white/5 border border-white/10 hover:bg-white/10'
                          }`}
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
                            <EmotionTag
                              emotion={dream.emotion}
                              size="sm"
                              showLabel={false}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn-secondary flex-1"
              >
                取消
              </button>
              <button
                onClick={handleCreateSeries}
                disabled={!name.trim()}
                className="btn-accent flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                创建系列
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
