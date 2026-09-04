import { useState } from 'react';
import { useAppStore } from '@/store/AppStore';
import { AddDishModal } from '@/components/AddDishModal';
import { SettingsModal } from '@/components/SettingsModal';
import type { MealType, Cuisine } from '@/types';

const MEAL_TABS: MealType[] = ['早餐', '午餐', '晚餐'];

export function Dishes() {
  const { allDishes, settings, dispatch } = useAppStore();
  const [activeMeal, setActiveMeal] = useState<MealType>(settings.selectedMealType);
  const [showAddDish, setShowAddDish] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const filtered = allDishes.filter((d) => d.mealType === activeMeal);
  const chineseDishes = filtered.filter((d) => d.cuisine === '中餐');
  const westernDishes = filtered.filter((d) => d.cuisine === '西餐');

  const handleAddDish = (dish: typeof allDishes[number]) => {
    dispatch({ type: 'ADD_DISH', dish });
    setShowAddDish(false);
  };

  const handleRemoveDish = (id: string) => {
    dispatch({ type: 'REMOVE_DISH', id });
  };

  const renderDishCard = (dish: typeof allDishes[number]) => (
    <div className="dish-card" key={dish.id}>
      <div className="d-emoji">{dish.emoji}</div>
      <div className="d-info">
        <div className="d-name">{dish.name}</div>
        <div className="d-desc">{dish.description}</div>
      </div>
      <span className="d-cat">{dish.cuisine}</span>
      <button className="d-delete" onClick={() => handleRemoveDish(dish.id)}>✕</button>
    </div>
  );

  const renderCuisineGroup = (label: string, cuisine: Cuisine) => {
    const list = cuisine === '中餐' ? chineseDishes : westernDishes;
    if (list.length === 0) return null;
    return (
      <div className="cuisine-group">
        <div className="cuisine-label">📌 {label}</div>
        {list.map(renderDishCard)}
      </div>
    );
  };

  return (
    <div className="page active">
      {/* Header */}
      <div className="dishes-header">
        <div className="dishes-title">🍽️ 菜品</div>
        <div className="dishes-actions">
          <button className="icon-btn" onClick={() => setShowSettings(true)}>⚙️</button>
          <button className="icon-btn primary" onClick={() => setShowAddDish(true)}>＋</button>
        </div>
      </div>

      {/* 用餐类型 Tabs */}
      <div className="meal-tabs">
        {MEAL_TABS.map((mt) => (
          <button
            key={mt}
            className={`meal-tab ${activeMeal === mt ? 'active' : ''}`}
            onClick={() => setActiveMeal(mt)}
          >
            {mt}
          </button>
        ))}
      </div>

      {/* 菜品列表 */}
      <div className="dishes-list">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 40 }}>🍽️</div>
            <div>该餐次还没有菜品</div>
          </div>
        ) : (
          <>
            {renderCuisineGroup('中餐', '中餐')}
            {renderCuisineGroup('西餐', '西餐')}
          </>
        )}
      </div>

      {/* 添加菜品弹窗 */}
      {showAddDish && (
        <AddDishModal
          defaultMealType={activeMeal}
          onClose={() => setShowAddDish(false)}
          onConfirm={handleAddDish}
        />
      )}

      {/* 设置弹窗 */}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
