import { Dream, WordCloudItem } from '@/types';

const STOP_WORDS = new Set([
  '的', '了', '是', '在', '我', '有', '和', '就', '不', '人', '都', '一', '一个',
  '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好',
  '自己', '这', '那', '她', '他', '它', '们', '这个', '那个', '什么', '怎么',
  '为什么', '可以', '因为', '所以', '但是', '然后', '还是', '或者', '如果',
  '只是', '已经', '正在', '可能', '应该', '能够', '需要', '觉得', '知道',
  '以为', '感觉', '好像', '似乎', '大概', '差不多', '一下', '一些', '一点',
  '起来', '出来', '过来', '进去', '出去', '上来', '下去', '回来', '过去',
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare',
  'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by',
  'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above',
  'below', 'between', 'under', 'again', 'further', 'then', 'once', 'here',
  'there', 'when', 'where', 'why', 'how', 'all', 'each', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 'just', 'but', 'also', 'and',
]);

const tokenize = (text: string): string[] => {
  const chineseWords = text.match(/[\u4e00-\u9fa5]{2,}/g) || [];
  const englishWords = text.match(/[a-zA-Z]{3,}/g) || [];
  
  const tokens: string[] = [];
  
  for (let i = 0; i < chineseWords.length; i++) {
    const word = chineseWords[i];
    for (let len = 2; len <= Math.min(4, word.length); len++) {
      for (let start = 0; start <= word.length - len; start++) {
        tokens.push(word.substring(start, start + len));
      }
    }
  }
  
  return [...tokens, ...englishWords.map(w => w.toLowerCase())];
};

export const generateWordCloud = (dreams: Dream[]): WordCloudItem[] => {
  const wordCount = new Map<string, number>();
  
  dreams.forEach(dream => {
    const text = `${dream.title} ${dream.content} ${dream.tags.join(' ')}`;
    const tokens = tokenize(text);
    
    tokens.forEach(token => {
      if (!STOP_WORDS.has(token) && token.length >= 2) {
        wordCount.set(token, (wordCount.get(token) || 0) + 1);
      }
    });
  });
  
  const words: WordCloudItem[] = Array.from(wordCount.entries())
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 50);
  
  if (words.length === 0) return [];
  
  const maxValue = Math.max(...words.map(w => w.value));
  const minValue = Math.min(...words.map(w => w.value));
  
  return words.map(word => ({
    ...word,
    value: minValue === maxValue ? 50 : Math.round(15 + ((word.value - minValue) / (maxValue - minValue)) * 85),
  }));
};

export const highlightText = (text: string, keyword: string): string => {
  if (!keyword.trim()) return text;
  
  const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '|||HIGHLIGHT|||$1|||/HIGHLIGHT|||');
};
