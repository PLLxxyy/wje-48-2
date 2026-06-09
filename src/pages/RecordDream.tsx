import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Clock, Moon, Tag } from 'lucide-react';
import { useDreamStore } from '@/store/dreamStore';
import { GlassCard } from '@/components/GlassCard';
import { EmotionTag } from '@/components/EmotionTag';
import { EmotionType } from '@/types';
import { format } from 'date-fns';

const emotions: EmotionType[] = ['happy', 'sad', 'fear', 'calm', 'excited', 'confused', 'angry', 'peaceful'];

export default function RecordDream() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addDream, updateDream, getDreamById } = useDreamStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [wakeUpTime, setWakeUpTime] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [sleepDuration, setSleepDuration] = useState(7);
  const [emotion, setEmotion] = useState<EmotionType>('peaceful');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      const dream = getDreamById(id);
      if (dream) {
        setTitle(dream.title);
        setContent(dream.content);
        setWakeUpTime(dream.wakeUpTime.substring(0, 16));
        setSleepDuration(dream.sleepDuration);
        setEmotion(dream.emotion);
        setTags(dream.tags);
      }
    }
  }, [id, isEditing, getDreamById]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const dreamData = {
      title: title.trim(),
      content: content.trim(),
      wakeUpTime: new Date(wakeUpTime).toISOString(),
      sleepDuration,
      emotion,
      tags,
    };

    if (isEditing) {
      updateDream(id, dreamData);
    } else {
      addDream(dreamData);
    }

    navigate('/dreams');
  };

  const sleepDurationHours = Math.floor(sleepDuration);
  const sleepDurationMinutes = Math.round((sleepDuration - sleepDurationHours) * 60);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <h1 className="font-display text-3xl font-bold text-white mb-2">
          {isEditing ? '编辑梦境' : '记录梦境'}
        </h1>
        <p className="text-white/60">
          {isEditing ? '修改这个梦境的记录' : '记录刚刚醒来时的梦境，趁记忆还清晰'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <GlassCard className="p-6 mb-6 animate-slide-up">
          <div className="mb-6">
            <label className="block text-white/80 font-medium mb-2">
              梦境标题
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="给这个梦境起个名字..."
              className="input-field font-display text-lg"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-white/80 font-medium mb-2">
              梦境内容
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="尽可能详细地描述你的梦境，包括场景、人物、情节、感受..."
              rows={10}
              className="input-field resize-none scrollbar-thin"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="flex items-center gap-2 text-white/80 font-medium mb-2">
                <Clock className="w-4 h-4" />
                醒来时间
              </label>
              <input
                type="datetime-local"
                value={wakeUpTime}
                onChange={(e) => setWakeUpTime(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-white/80 font-medium mb-2">
                <Moon className="w-4 h-4" />
                睡眠时长：{sleepDurationHours}小时{sleepDurationMinutes > 0 ? ` ${sleepDurationMinutes}分钟` : ''}
              </label>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={sleepDuration}
                onChange={(e) => setSleepDuration(parseFloat(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-dream-primary"
              />
              <div className="flex justify-between text-xs text-white/40 mt-1">
                <span>0h</span>
                <span>6h</span>
                <span>12h</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-white/80 font-medium mb-3">
              情绪感受
            </label>
            <div className="flex flex-wrap gap-3">
              {emotions.map((e) => (
                <EmotionTag
                  key={e}
                  emotion={e}
                  selected={emotion === e}
                  onClick={() => setEmotion(e)}
                />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2 text-white/80 font-medium mb-2">
              <Tag className="w-4 h-4" />
              标签
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-dream-primary/20 text-dream-purpleSoft text-sm rounded-full border border-dream-primary/30"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="输入标签后按回车添加..."
              className="input-field"
            />
          </div>
        </GlassCard>

        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            取消
          </button>
          <button type="submit" className="btn-accent flex items-center gap-2">
            <Save className="w-5 h-5" />
            {isEditing ? '保存修改' : '保存梦境'}
          </button>
        </div>
      </form>
    </div>
  );
}
