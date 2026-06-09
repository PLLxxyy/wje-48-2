export type EmotionType =
  | 'happy'
  | 'sad'
  | 'fear'
  | 'calm'
  | 'excited'
  | 'confused'
  | 'angry'
  | 'peaceful';

export interface Dream {
  id: string;
  title: string;
  content: string;
  wakeUpTime: string;
  sleepDuration: number;
  emotion: EmotionType;
  tags: string[];
  seriesId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Series {
  id: string;
  name: string;
  description: string;
  dreamIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  keyword: string;
  emotion?: EmotionType;
  startDate?: string;
  endDate?: string;
}

export interface WordCloudItem {
  text: string;
  value: number;
}

export interface EmotionStat {
  emotion: EmotionType;
  count: number;
  percentage: number;
}

export type ExportFormat = 'markdown' | 'json';

export interface ExportOptions {
  format: ExportFormat;
  startDate?: string;
  endDate?: string;
}

export const EMOTION_LABELS: Record<EmotionType, string> = {
  happy: '开心',
  sad: '悲伤',
  fear: '恐惧',
  calm: '平静',
  excited: '兴奋',
  confused: '困惑',
  angry: '愤怒',
  peaceful: '祥和',
};

export const EMOTION_EMOJIS: Record<EmotionType, string> = {
  happy: '😊',
  sad: '😢',
  fear: '😨',
  calm: '😌',
  excited: '🤩',
  confused: '😕',
  angry: '😠',
  peaceful: '🧘',
};

export const STORAGE_KEYS = {
  DREAMS: 'dream_diary_dreams',
  SERIES: 'dream_diary_series',
  SETTINGS: 'dream_diary_settings',
};
