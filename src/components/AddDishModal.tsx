import { useState, useEffect } from 'react';
import type { Dish, MealType, Cuisine } from '@/types';
import { EMOJI_OPTIONS_BY_CATEGORY } from '@/data/dishes';
import type { EmojiCategory } from '@/data/dishes';
import { genId } from '@/utils/randomPick';

interface AddDishModalProps {
  defaultMealType?: MealType;
  onClose: () => void;
  onConfirm: (dish: Dish) => void;
}

const MEAL_TYPES: MealType[] = ['早餐', '午餐', '晚餐'];
const CUISINES: Cuisine[] = ['中餐', '西餐'];
const EMOJI_CATEGORIES: EmojiCategory[] = ['蔬菜', '肉类', '水产', '面点', '饮品', '水果', '其他'];

export function AddDishModal({ defaultMealType, onClose, onConfirm }: AddDishModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const [name, setName] = useState('');
  const [emojiCategory, setEmojiCategory] = useState<EmojiCategory>('蔬菜');
  const [emoji, setEmoji] = useState(EMOJI_OPTIONS_BY_CATEGORY['蔬菜'][0]);
  const [mealType, setMealType] = useState<MealType>(defaultMealType ?? '午餐');
  const [cuisine, setCuisine] = useState<Cuisine>('中餐');
  const [description, setDescription] = useState('');

  const handleConfirm = () => {
    if (!name.trim()) return;
    onConfirm({
      id: genId(),
      name: name.trim(),
      emoji,
      mealType,
      cuisine,
      description: description.trim() || '自定义菜品',
      builtIn: false,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-title">添加新菜品</div>

        <div className="form-group">
          <label className="form-label">菜品名称</label>
          <input
            className="form-input"
            type="text"
            placeholder="如：黄焖鸡米饭"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>

        <div className="form-group">
          <div className="emoji-cat-bar">
            {EMOJI_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`emoji-cat-btn ${emojiCategory === cat ? 'selected' : ''}`}
                onClick={() => {
                  setEmojiCategory(cat);
                  setEmoji(EMOJI_OPTIONS_BY_CATEGORY[cat][0]);
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="emoji-picker">
            {EMOJI_OPTIONS_BY_CATEGORY[emojiCategory].map((em) => (
              <button
                key={em}
                className={`emoji-option ${emoji === em ? 'selected' : ''}`}
                onClick={() => setEmoji(em)}
              >
                {em}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">用餐类型</label>
          <div className="cat-picker">
            {MEAL_TYPES.map((mt) => (
              <button
                key={mt}
                className={`cat-option ${mealType === mt ? 'selected' : ''}`}
                onClick={() => setMealType(mt)}
              >
                {mt}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">菜系偏好</label>
          <div className="cat-picker">
            {CUISINES.map((c) => (
              <button
                key={c}
                className={`cat-option ${cuisine === c ? 'selected' : ''}`}
                onClick={() => setCuisine(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">描述（选填）</label>
          <input
            className="form-input"
            type="text"
            placeholder="简单描述一下"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>取消</button>
          <button
            className="btn-confirm"
            onClick={handleConfirm}
            disabled={!name.trim()}
          >
            确认添加
          </button>
        </div>
      </div>
    </div>
  );
}
