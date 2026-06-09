import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const formatDateTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'yyyy年MM月dd日 HH:mm', { locale: zhCN });
  } catch {
    return dateString;
  }
};

export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'yyyy年MM月dd日', { locale: zhCN });
  } catch {
    return dateString;
  }
};

export const formatTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'HH:mm', { locale: zhCN });
  } catch {
    return dateString;
  }
};

export const formatSleepDuration = (hours: number): string => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  if (minutes === 0) {
    return `${wholeHours} 小时`;
  }
  return `${wholeHours} 小时 ${minutes} 分钟`;
};

export const getMonthYear = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'yyyy年MM月', { locale: zhCN });
  } catch {
    return dateString;
  }
};
