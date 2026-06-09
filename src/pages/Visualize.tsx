import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloud, PieChart, Calendar, TrendingUp } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useDreamStore } from '@/store/dreamStore';
import { GlassCard } from '@/components/GlassCard';
import { generateWordCloud } from '@/utils/wordAnalysis';
import { EMOTION_LABELS, EmotionType } from '@/types';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const EMOTION_COLORS: Record<EmotionType, string> = {
  happy: '#ffd166',
  sad: '#4cc9f0',
  fear: '#7209b7',
  calm: '#90be6d',
  excited: '#f72585',
  confused: '#f8961e',
  angry: '#d62828',
  peaceful: '#4361ee',
};

export default function Visualize() {
  const navigate = useNavigate();
  const { dreams, getEmotionStats, setSearchFilters } = useDreamStore();
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const emotionStats = useMemo(() => {
    return getEmotionStats(selectedMonth || undefined).filter((s) => s.count > 0);
  }, [selectedMonth, getEmotionStats]);

  const wordCloudData = useMemo(() => {
    if (selectedMonth) {
      const filteredDreams = dreams.filter((d) => {
        const dreamMonth = new Date(d.wakeUpTime).toISOString().substring(0, 7);
        return dreamMonth === selectedMonth;
      });
      return generateWordCloud(filteredDreams);
    }
    return generateWordCloud(dreams);
  }, [dreams, selectedMonth]);

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    dreams.forEach((d) => {
      months.add(new Date(d.wakeUpTime).toISOString().substring(0, 7));
    });
    return Array.from(months).sort().reverse();
  }, [dreams]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || wordCloudData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    ctx.clearRect(0, 0, rect.width, rect.height);

    const colors = [
      '#9d4edd', '#c77dff', '#7b2cbf', '#a0c4ff', '#ffd700',
      '#ffc8dd', '#bde0fe', '#ffafcc', '#cdb4db', '#a2d2ff',
    ];

    const placedBoxes: { x: number; y: number; width: number; height: number }[] = [];

    const checkCollision = (x: number, y: number, width: number, height: number): boolean => {
      return placedBoxes.some(
        (box) =>
          x < box.x + box.width &&
          x + width > box.x &&
          y < box.y + box.height &&
          y + height > box.y
      );
    };

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    wordCloudData.forEach((item, index) => {
      const fontSize = item.value;
      ctx.font = `bold ${fontSize}px 'Playfair Display', serif`;
      const metrics = ctx.measureText(item.text);
      const textWidth = metrics.width;
      const textHeight = fontSize;

      let placed = false;
      let angle = 0;
      let radius = 0;
      const maxRadius = Math.min(rect.width, rect.height) / 2 - 20;

      while (!placed && radius < maxRadius) {
        const x = centerX + radius * Math.cos(angle) - textWidth / 2;
        const y = centerY + radius * Math.sin(angle) + textHeight / 4;

        if (
          x > 10 &&
          x + textWidth < rect.width - 10 &&
          y - textHeight > 10 &&
          y < rect.height - 10 &&
          !checkCollision(x, y - textHeight, textWidth, textHeight)
        ) {
          ctx.fillStyle = colors[index % colors.length];
          ctx.shadowColor = colors[index % colors.length];
          ctx.shadowBlur = 10;
          ctx.fillText(item.text, x, y);
          ctx.shadowBlur = 0;

          placedBoxes.push({ x, y: y - textHeight, width: textWidth, height: textHeight });
          placed = true;
        }

        angle += 0.5;
        if (angle > Math.PI * 2) {
          angle = 0;
          radius += 10;
        }
      }
    });
  }, [wordCloudData]);

  const handleWordClick = (word: string) => {
    setSearchFilters({ keyword: word });
    navigate('/dreams');
  };

  if (dreams.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <GlassCard className="p-12 text-center animate-fade-in">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-white/60 mb-4">还没有数据可以可视化</p>
          <button onClick={() => navigate('/record')} className="btn-primary">
            记录第一个梦境
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <h1 className="font-display text-3xl font-bold text-white mb-2">数据可视化</h1>
        <p className="text-white/60">探索你的梦境模式和潜意识规律</p>
      </div>

      {/* 月份筛选 */}
      <div className="mb-6 flex flex-wrap items-center gap-3 animate-slide-up">
        <Calendar className="w-5 h-5 text-white/50" />
        <span className="text-white/60">选择月份：</span>
        <button
          onClick={() => setSelectedMonth('')}
          className={`px-4 py-2 rounded-xl transition-all ${
            !selectedMonth
              ? 'bg-dream-primary text-white shadow-glow'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          全部
        </button>
        {availableMonths.map((month) => (
          <button
            key={month}
            onClick={() => setSelectedMonth(month)}
            className={`px-4 py-2 rounded-xl transition-all ${
              selectedMonth === month
                ? 'bg-dream-primary text-white shadow-glow'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {format(new Date(month + '-01'), 'yyyy年MM月', { locale: zhCN })}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 词云 */}
        <GlassCard className="p-6 animate-stagger">
          <div className="flex items-center gap-2 mb-4">
            <Cloud className="w-5 h-5 text-dream-primary" />
            <h2 className="font-display text-xl font-semibold text-white">高频词汇</h2>
          </div>
          <p className="text-white/50 text-sm mb-4">点击词汇可搜索相关梦境</p>
          {wordCloudData.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-white/40">
              暂无数据
            </div>
          ) : (
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="w-full h-80"
                style={{ cursor: 'pointer' }}
              />
              <div className="flex flex-wrap gap-2 mt-4">
                {wordCloudData.slice(0, 12).map((item, index) => (
                  <button
                    key={item.text}
                    onClick={() => handleWordClick(item.text)}
                    className="px-3 py-1.5 rounded-full text-sm transition-all hover:scale-105"
                    style={{
                      backgroundColor: `${[
                        '#9d4edd', '#c77dff', '#7b2cbf', '#a0c4ff', '#ffd700',
                      ][index % 5]}20`,
                      color: ['#9d4edd', '#c77dff', '#7b2cbf', '#a0c4ff', '#ffd700'][index % 5],
                      border: `1px solid ${['#9d4edd', '#c77dff', '#7b2cbf', '#a0c4ff', '#ffd700'][index % 5]}30`,
                    }}
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </GlassCard>

        {/* 情绪分布饼图 */}
        <GlassCard className="p-6 animate-stagger">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-dream-primary" />
            <h2 className="font-display text-xl font-semibold text-white">情绪分布</h2>
          </div>
          {emotionStats.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-white/40">
              暂无数据
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={emotionStats}
                    dataKey="count"
                    nameKey="emotion"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    label={({ name, percent }) => `${EMOTION_LABELS[name as EmotionType]} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {emotionStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={EMOTION_COLORS[entry.emotion as EmotionType]}
                        fillOpacity={0.8}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(26, 10, 46, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: 'white',
                    }}
                    formatter={(value: number, name: string) => [
                      `${value} 个梦境`,
                      EMOTION_LABELS[name as EmotionType],
                    ]}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>

        {/* 情绪统计柱状图 */}
        <GlassCard className="p-6 lg:col-span-2 animate-stagger">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-dream-primary" />
            <h2 className="font-display text-xl font-semibold text-white">情绪统计</h2>
          </div>
          {emotionStats.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-white/40">
              暂无数据
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emotionStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis
                    dataKey="emotion"
                    tickFormatter={(value) => EMOTION_LABELS[value as EmotionType]}
                    stroke="rgba(255, 255, 255, 0.3)"
                  />
                  <YAxis stroke="rgba(255, 255, 255, 0.3)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(26, 10, 46, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: 'white',
                    }}
                    formatter={(value: number, name: string) => [
                      `${value} 个梦境`,
                      name === 'count' ? '数量' : name,
                    ]}
                    labelFormatter={(label) => EMOTION_LABELS[label as EmotionType]}
                  />
                  <Bar
                    dataKey="count"
                    radius={[8, 8, 0, 0]}
                    barSize={40}
                  >
                    {emotionStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={EMOTION_COLORS[entry.emotion as EmotionType]}
                        fillOpacity={0.8}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
