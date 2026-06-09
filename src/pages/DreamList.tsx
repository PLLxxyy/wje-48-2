import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Link2 } from 'lucide-react';
import { useDreamStore } from '@/store/dreamStore';
import { DreamCard } from '@/components/DreamCard';
import { SearchBar } from '@/components/SearchBar';
import { GlassCard } from '@/components/GlassCard';
import { Dream, EmotionType } from '@/types';

export default function DreamList() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    searchFilters,
    setSearchFilters,
    resetSearchFilters,
    getFilteredDreams,
    deleteDream,
    series,
    dreams,
    addDreamToSeries,
    toggleFavorite,
  } = useDreamStore();

  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [showSeriesModal, setShowSeriesModal] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const favoriteParam = params.get('favorite');
    if (favoriteParam === '1') {
      setSearchFilters({ isFavorite: true });
    }
  }, [location.search, setSearchFilters]);

  const filteredDreams = getFilteredDreams();

  const handleEdit = (dream: Dream) => {
    navigate(`/record/${dream.id}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这个梦境吗？')) {
      deleteDream(id);
    }
  };

  const handleAddToSeries = (dream: Dream) => {
    setSelectedDream(dream);
    setShowSeriesModal(true);
  };

  const handleConfirmAddToSeries = (seriesId: string) => {
    if (selectedDream) {
      if (selectedDream.seriesId && selectedDream.seriesId !== seriesId) {
        const oldSeries = series.find((s) => s.id === selectedDream.seriesId);
        const newSeries = series.find((s) => s.id === seriesId);
        const confirmMsg = `「${selectedDream.title}」当前属于「${oldSeries?.name || '未知系列'}」，将移动到「${newSeries?.name || '未知系列'}」。确定继续？`;
        if (!window.confirm(confirmMsg)) return;
      } else if (selectedDream.seriesId === seriesId) {
        window.alert('这个梦境已经在该系列中');
        return;
      }
      addDreamToSeries(seriesId, selectedDream.id);
      setShowSeriesModal(false);
      setSelectedDream(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">梦境列表</h1>
          <p className="text-white/60">
            {filteredDreams.length > 0
              ? `找到 ${filteredDreams.length} 个梦境记录`
              : '还没有匹配的梦境记录'}
          </p>
        </div>
        <button
          onClick={() => navigate('/record')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          记录梦境
        </button>
      </div>

      <SearchBar
        keyword={searchFilters.keyword}
        onKeywordChange={(value) => setSearchFilters({ keyword: value })}
        emotion={searchFilters.emotion as EmotionType}
        onEmotionChange={(value) => setSearchFilters({ emotion: value })}
        startDate={searchFilters.startDate}
        onStartDateChange={(value) => setSearchFilters({ startDate: value })}
        endDate={searchFilters.endDate}
        onEndDateChange={(value) => setSearchFilters({ endDate: value })}
        isFavorite={searchFilters.isFavorite}
        onIsFavoriteChange={(value) => setSearchFilters({ isFavorite: value })}
        onReset={resetSearchFilters}
      />

      {filteredDreams.length === 0 ? (
        <GlassCard className="p-12 text-center animate-fade-in">
          <div className="text-6xl mb-4">🌙</div>
          <p className="text-white/60 mb-4">
            {searchFilters.keyword || searchFilters.emotion || searchFilters.startDate || searchFilters.endDate || searchFilters.isFavorite !== undefined
              ? '没有找到匹配的梦境记录'
              : '还没有记录任何梦境'}
          </p>
          <button onClick={() => navigate('/record')} className="btn-primary">
            记录第一个梦境
          </button>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {filteredDreams.map((dream) => (
            <DreamCard
              key={dream.id}
              dream={dream}
              searchKeyword={searchFilters.keyword}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddToSeries={handleAddToSeries}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}

      {/* 添加到系列的弹窗 */}
      {showSeriesModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <GlassCard className="p-6 w-full max-w-md animate-slide-up">
            <h3 className="font-display text-xl font-bold text-white mb-2">
              选择要加入的系列
            </h3>
            {selectedDream && (
              <div className="mb-4 p-3 bg-white/5 rounded-lg">
                <p className="text-sm text-white/60">
                  梦境：<span className="text-white">{selectedDream.title}</span>
                </p>
                {selectedDream.seriesId && (
                  <p className="text-sm text-dream-accent mt-1">
                  当前属于「
                  {series.find((s) => s.id === selectedDream.seriesId)?.name || '未知系列'}
                  」系列
                  </p>
                )}
              </div>
            )}
            {series.length === 0 ? (
              <p className="text-white/60 mb-6">还没有创建任何系列</p>
            ) : (
              <div className="space-y-2 mb-6 max-h-60 overflow-y-auto scrollbar-thin">
                {series.map((s) => {
                  const isCurrentSeries = selectedDream?.seriesId === s.id;
                  const dreamCount = s.dreamIds.filter(
                    (id) => dreams.find((d) => d.id === id && d.seriesId === s.id)
                  ).length;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleConfirmAddToSeries(s.id)}
                      disabled={isCurrentSeries}
                      className={`w-full p-4 text-left rounded-xl transition-all ${
                        isCurrentSeries
                          ? 'bg-dream-primary/20 border-2 border-dream-primary/50 cursor-not-allowed'
                          : 'glass-card-hover'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">{s.name}</p>
                          <p className="text-sm text-white/50">{dreamCount} 个梦境</p>
                        </div>
                        {isCurrentSeries && (
                          <span className="text-xs text-dream-primary">当前系列</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/series')}
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
              >
                <Link2 className="w-4 h-4" />
                创建新系列
              </button>
              <button
                onClick={() => {
                  setShowSeriesModal(false);
                  setSelectedDream(null);
                }}
                className="btn-secondary flex-1"
              >
                取消
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
