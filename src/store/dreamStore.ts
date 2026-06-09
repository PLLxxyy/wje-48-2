import { create } from 'zustand';
import { Dream, Series, SearchFilters, EmotionType, EmotionStat } from '@/types';
import { getDreams, saveDreams, getSeries, saveSeries, generateId } from '@/utils/storage';
import { sampleDreams, sampleSeries } from '@/data/sampleData';

interface DreamState {
  dreams: Dream[];
  series: Series[];
  searchFilters: SearchFilters;
  isInitialized: boolean;

  initializeData: () => void;
  addDream: (dream: Omit<Dream, 'id' | 'createdAt' | 'updatedAt' | 'isFavorite'>) => void;
  updateDream: (id: string, updates: Partial<Dream>) => void;
  deleteDream: (id: string) => void;
  getDreamById: (id: string) => Dream | undefined;
  toggleFavorite: (id: string) => void;
  getFavoriteDreams: () => Dream[];

  addSeries: (series: Omit<Series, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSeries: (id: string, updates: Partial<Series>) => void;
  deleteSeries: (id: string) => void;
  getSeriesById: (id: string) => Series | undefined;
  addDreamToSeries: (seriesId: string, dreamId: string) => void;
  removeDreamFromSeries: (seriesId: string, dreamId: string) => void;

  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  resetSearchFilters: () => void;
  getFilteredDreams: () => Dream[];

  getEmotionStats: (month?: string) => EmotionStat[];
  getRandomDream: () => Dream | null;
  getRandomDreamFragment: () => { dream: Dream; fragment: string } | null;
  checkAndFixConsistency: () => {
    issues: string[];
    fixed: number;
  };
}

export const useDreamStore = create<DreamState>((set, get) => ({
  dreams: [],
  series: [],
  searchFilters: {
    keyword: '',
    emotion: undefined,
    startDate: undefined,
    endDate: undefined,
    isFavorite: undefined,
  },
  isInitialized: false,

  initializeData: () => {
    const storedDreams = getDreams();
    const storedSeries = getSeries();

    if (storedDreams.length === 0 && storedSeries.length === 0) {
      set({
        dreams: sampleDreams,
        series: sampleSeries,
        isInitialized: true,
      });
      saveDreams(sampleDreams);
      saveSeries(sampleSeries);
    } else {
      set({
        dreams: storedDreams,
        series: storedSeries,
        isInitialized: true,
      });
    }

    setTimeout(() => {
      get().checkAndFixConsistency();
    }, 100);
  },

  addDream: (dreamData) => {
    const newDream: Dream = {
      ...dreamData,
      id: generateId(),
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const dreams = [...get().dreams, newDream];
    set({ dreams });
    saveDreams(dreams);
  },

  toggleFavorite: (id) => {
    const dreams = get().dreams.map((d) =>
      d.id === id ? { ...d, isFavorite: !d.isFavorite, updatedAt: new Date().toISOString() } : d
    );
    set({ dreams });
    saveDreams(dreams);
  },

  getFavoriteDreams: () => {
    return get().dreams.filter((d) => d.isFavorite);
  },

  updateDream: (id, updates) => {
    const dreams = get().dreams.map((d) =>
      d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
    );
    set({ dreams });
    saveDreams(dreams);
  },

  deleteDream: (id) => {
    const dreams = get().dreams.filter((d) => d.id !== id);
    const series = get().series.map((s) => ({
      ...s,
      dreamIds: s.dreamIds.filter((did) => did !== id),
    }));
    set({ dreams, series });
    saveDreams(dreams);
    saveSeries(series);
  },

  getDreamById: (id) => {
    return get().dreams.find((d) => d.id === id);
  },

  addSeries: (seriesData) => {
    const state = get();
    const newSeries: Series = {
      ...seriesData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let series = [...state.series, newSeries];

    if (seriesData.dreamIds && seriesData.dreamIds.length > 0) {
      const affectedDreamIds = seriesData.dreamIds;
      
      series = series.map((s) => {
        if (s.id === newSeries.id) return s;
        const filteredDreamIds = s.dreamIds.filter((id) => !affectedDreamIds.includes(id));
        if (filteredDreamIds.length !== s.dreamIds.length) {
          return { ...s, dreamIds: filteredDreamIds, updatedAt: new Date().toISOString() };
        }
        return s;
      });

      const dreams = state.dreams.map((d) =>
        affectedDreamIds.includes(d.id)
          ? { ...d, seriesId: newSeries.id, updatedAt: new Date().toISOString() }
          : d
      );

      set({ series, dreams });
      saveSeries(series);
      saveDreams(dreams);
    } else {
      set({ series });
      saveSeries(series);
    }
  },

  updateSeries: (id, updates) => {
    const series = get().series.map((s) =>
      s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
    );
    set({ series });
    saveSeries(series);
  },

  deleteSeries: (id) => {
    const series = get().series.filter((s) => s.id !== id);
    const dreams = get().dreams.map((d) =>
      d.seriesId === id
        ? { ...d, seriesId: undefined, updatedAt: new Date().toISOString() }
        : d
    );
    set({ series, dreams });
    saveSeries(series);
    saveDreams(dreams);
  },

  getSeriesById: (id) => {
    return get().series.find((s) => s.id === id);
  },

  addDreamToSeries: (seriesId, dreamId) => {
    const state = get();
    const dream = state.dreams.find((d) => d.id === dreamId);
    const oldSeriesId = dream?.seriesId;

    let series = state.series;

    if (oldSeriesId && oldSeriesId !== seriesId) {
      series = series.map((s) =>
        s.id === oldSeriesId
          ? { ...s, dreamIds: s.dreamIds.filter((id) => id !== dreamId), updatedAt: new Date().toISOString() }
          : s
      );
    }

    series = series.map((s) =>
      s.id === seriesId && !s.dreamIds.includes(dreamId)
        ? { ...s, dreamIds: [...s.dreamIds, dreamId], updatedAt: new Date().toISOString() }
        : s
    );

    const dreams = state.dreams.map((d) =>
      d.id === dreamId
        ? { ...d, seriesId, updatedAt: new Date().toISOString() }
        : d
    );

    set({ series, dreams });
    saveSeries(series);
    saveDreams(dreams);
  },

  removeDreamFromSeries: (seriesId, dreamId) => {
    const series = get().series.map((s) =>
      s.id === seriesId
        ? { ...s, dreamIds: s.dreamIds.filter((id) => id !== dreamId), updatedAt: new Date().toISOString() }
        : s
    );
    const dreams = get().dreams.map((d) =>
      d.id === dreamId && d.seriesId === seriesId
        ? { ...d, seriesId: undefined, updatedAt: new Date().toISOString() }
        : d
    );
    set({ series, dreams });
    saveSeries(series);
    saveDreams(dreams);
  },

  setSearchFilters: (filters) => {
    set((state) => ({
      searchFilters: { ...state.searchFilters, ...filters },
    }));
  },

  resetSearchFilters: () => {
    set({
      searchFilters: {
        keyword: '',
        emotion: undefined,
        startDate: undefined,
        endDate: undefined,
        isFavorite: undefined,
      },
    });
  },

  getFilteredDreams: () => {
    const { dreams, searchFilters } = get();
    const { keyword, emotion, startDate, endDate, isFavorite } = searchFilters;

    return dreams
      .filter((dream) => {
        if (keyword) {
          const lowerKeyword = keyword.toLowerCase();
          const matchesTitle = dream.title.toLowerCase().includes(lowerKeyword);
          const matchesContent = dream.content.toLowerCase().includes(lowerKeyword);
          const matchesTags = dream.tags.some((t) => t.toLowerCase().includes(lowerKeyword));
          if (!matchesTitle && !matchesContent && !matchesTags) return false;
        }

        if (emotion && dream.emotion !== emotion) return false;

        if (startDate && new Date(dream.wakeUpTime) < new Date(startDate)) return false;

        if (endDate && new Date(dream.wakeUpTime) > new Date(endDate + 'T23:59:59')) return false;

        if (isFavorite !== undefined && dream.isFavorite !== isFavorite) return false;

        return true;
      })
      .sort((a, b) => new Date(b.wakeUpTime).getTime() - new Date(a.wakeUpTime).getTime());
  },

  getEmotionStats: (month) => {
    let dreams = get().dreams;

    if (month) {
      dreams = dreams.filter((d) => {
        const dreamMonth = new Date(d.wakeUpTime).toISOString().substring(0, 7);
        return dreamMonth === month;
      });
    }

    const emotionCounts: Record<EmotionType, number> = {
      happy: 0,
      sad: 0,
      fear: 0,
      calm: 0,
      excited: 0,
      confused: 0,
      angry: 0,
      peaceful: 0,
    };

    dreams.forEach((dream) => {
      emotionCounts[dream.emotion]++;
    });

    const total = dreams.length;

    return (Object.entries(emotionCounts) as [EmotionType, number][]).map(([emotion, count]) => ({
      emotion,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }));
  },

  getRandomDream: () => {
    const dreams = get().dreams;
    if (dreams.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * dreams.length);
    return dreams[randomIndex];
  },

  getRandomDreamFragment: () => {
    const dream = get().getRandomDream();
    if (!dream) return null;

    const content = dream.content;
    const fragmentLength = Math.min(80, Math.max(50, content.length));
    const maxStart = content.length - fragmentLength;
    const startIndex = maxStart > 0 ? Math.floor(Math.random() * maxStart) : 0;
    const fragment = content.substring(startIndex, startIndex + fragmentLength);

    const paddedFragment = startIndex > 0 ? '...' + fragment : fragment;
    const finalFragment = startIndex + fragmentLength < content.length ? paddedFragment + '...' : paddedFragment;

    return { dream, fragment: finalFragment };
  },

  checkAndFixConsistency: () => {
    const state = get();
    const issues: string[] = [];
    let fixedCount = 0;

    let dreams = [...state.dreams];
    let series = [...state.series];

    dreams.forEach((dream) => {
      if (dream.seriesId) {
        const targetSeries = series.find((s) => s.id === dream.seriesId);
        if (!targetSeries) {
          issues.push(`梦境「${dream.title}」的 seriesId 指向不存在的系列`);
          dreams = dreams.map((d) =>
            d.id === dream.id ? { ...d, seriesId: undefined, updatedAt: new Date().toISOString() } : d
          );
          fixedCount++;
        } else if (!targetSeries.dreamIds.includes(dream.id)) {
          issues.push(`梦境「${dream.title}」的 seriesId 与系列「${targetSeries.name}」的 dreamIds 不一致`);
          series = series.map((s) =>
            s.id === targetSeries.id
              ? { ...s, dreamIds: [...s.dreamIds, dream.id], updatedAt: new Date().toISOString() }
              : s
          );
          fixedCount++;
        }
      }
    });

    series.forEach((s) => {
      s.dreamIds.forEach((dreamId) => {
        const dream = dreams.find((d) => d.id === dreamId);
        if (!dream) {
          issues.push(`系列「${s.name}」的 dreamIds 包含不存在的梦境 ${dreamId}`);
          series = series.map((seriesItem) =>
            seriesItem.id === s.id
              ? {
                  ...seriesItem,
                  dreamIds: seriesItem.dreamIds.filter((id) => id !== dreamId),
                  updatedAt: new Date().toISOString(),
                }
              : seriesItem
          );
          fixedCount++;
        } else if (dream.seriesId !== s.id) {
          if (dream.seriesId) {
            issues.push(`梦境「${dream.title}」同时属于系列「${s.name}」和「${series.find((x) => x.id === dream.seriesId)?.name || '未知'}」`);
            series = series.map((seriesItem) =>
              seriesItem.id === s.id
                ? {
                    ...seriesItem,
                    dreamIds: seriesItem.dreamIds.filter((id) => id !== dreamId),
                    updatedAt: new Date().toISOString(),
                  }
                : seriesItem
            );
          } else {
            issues.push(`系列「${s.name}」包含梦境「${dream.title}」，但该梦境未设置 seriesId`);
            dreams = dreams.map((d) =>
              d.id === dreamId ? { ...d, seriesId: s.id, updatedAt: new Date().toISOString() } : d
            );
          }
          fixedCount++;
        }
      });
    });

    if (fixedCount > 0) {
      set({ dreams, series });
      saveDreams(dreams);
      saveSeries(series);
    }

    return { issues, fixed: fixedCount };
  },
}));
