import { Dream, Series, STORAGE_KEYS } from '@/types';

const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

export const getDreams = (): Dream[] => {
  return getFromStorage<Dream[]>(STORAGE_KEYS.DREAMS, []);
};

export const saveDreams = (dreams: Dream[]): void => {
  saveToStorage(STORAGE_KEYS.DREAMS, dreams);
};

export const getSeries = (): Series[] => {
  return getFromStorage<Series[]>(STORAGE_KEYS.SERIES, []);
};

export const saveSeries = (series: Series[]): void => {
  saveToStorage(STORAGE_KEYS.SERIES, series);
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
