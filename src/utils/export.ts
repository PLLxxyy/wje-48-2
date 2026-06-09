import { Dream, Series, ExportOptions, EMOTION_LABELS } from '@/types';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const filterDreamsByDate = (dreams: Dream[], startDate?: string, endDate?: string): Dream[] => {
  return dreams.filter(dream => {
    const dreamDate = new Date(dream.wakeUpTime);
    if (startDate && dreamDate < new Date(startDate)) return false;
    if (endDate && dreamDate > new Date(endDate + 'T23:59:59')) return false;
    return true;
  });
};

const exportToMarkdown = (dreams: Dream[], series: Series[], options: ExportOptions): string => {
  const filteredDreams = filterDreamsByDate(dreams, options.startDate, options.endDate);
  
  let markdown = '# 梦境日记备份\n\n';
  markdown += `导出时间: ${format(new Date(), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}\n\n`;
  markdown += `共 ${filteredDreams.length} 个梦境记录\n\n`;
  markdown += '---\n\n';

  const seriesMap = new Map(series.map(s => [s.id, s]));
  
  filteredDreams
    .sort((a, b) => new Date(b.wakeUpTime).getTime() - new Date(a.wakeUpTime).getTime())
    .forEach(dream => {
      let dreamSeries: Series | undefined;
      if (dream.seriesId) {
        const s = seriesMap.get(dream.seriesId);
        if (s && s.dreamIds.includes(dream.id)) {
          dreamSeries = s;
        }
      }
      
      markdown += `## ${dream.title}\n\n`;
      markdown += `**醒来时间**: ${format(new Date(dream.wakeUpTime), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}\n\n`;
      markdown += `**睡眠时长**: ${dream.sleepDuration} 小时\n\n`;
      markdown += `**情绪感受**: ${EMOTION_LABELS[dream.emotion]}\n\n`;
      
      if (dream.tags.length > 0) {
        markdown += `**标签**: ${dream.tags.join(', ')}\n\n`;
      }
      
      if (dreamSeries) {
        markdown += `**所属系列**: ${dreamSeries.name}\n\n`;
      }
      
      markdown += `---\n\n${dream.content}\n\n`;
    });

  if (series.length > 0) {
    markdown += '\n---\n\n## 梦境系列\n\n';
    series.forEach(s => {
      const seriesDreams = filteredDreams.filter(
        d => s.dreamIds.includes(d.id) && d.seriesId === s.id
      );
      if (seriesDreams.length > 0) {
        markdown += `### ${s.name}\n\n`;
        if (s.description) {
          markdown += `${s.description}\n\n`;
        }
        markdown += `包含 ${seriesDreams.length} 个梦境\n\n`;
      }
    });
  }

  return markdown;
};

const exportToJson = (dreams: Dream[], series: Series[], options: ExportOptions): string => {
  const filteredDreams = filterDreamsByDate(dreams, options.startDate, options.endDate);
  
  const validSeries = series.map(s => ({
    ...s,
    dreamIds: s.dreamIds.filter(
      id => filteredDreams.some(d => d.id === id && d.seriesId === s.id)
    ),
  })).filter(s => s.dreamIds.length > 0);

  const data = {
    exportedAt: new Date().toISOString(),
    dreams: filteredDreams,
    series: validSeries,
    statistics: {
      totalDreams: filteredDreams.length,
      dateRange: {
        start: options.startDate || null,
        end: options.endDate || null,
      },
    },
  };
  
  return JSON.stringify(data, null, 2);
};

export const exportDreams = (
  dreams: Dream[],
  series: Series[],
  options: ExportOptions
): void => {
  let content: string;
  let filename: string;
  let mimeType: string;

  if (options.format === 'markdown') {
    content = exportToMarkdown(dreams, series, options);
    filename = `梦境日记_${format(new Date(), 'yyyyMMdd')}.md`;
    mimeType = 'text/markdown';
  } else {
    content = exportToJson(dreams, series, options);
    filename = `梦境日记_${format(new Date(), 'yyyyMMdd')}.json`;
    mimeType = 'application/json';
  }

  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
