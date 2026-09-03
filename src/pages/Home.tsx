import { useState, useCallback, useEffect, useRef } from 'react';
import { useAppStore } from '@/store/AppStore';
import { pickRandomDish } from '@/utils/randomPick';
import { SlotMachine } from '@/components/SlotMachine';
import { Wheel } from '@/components/Wheel';
import type { Dish, MealType, Cuisine, AnimationMode } from '@/types';

const MEAL_TYPES: { value: MealType; icon: string }[] = [
  { value: '早餐', icon: '🌅' },
  { value: '午餐', icon: '☀️' },
  { value: '晚餐', icon: '🌙' },
];

const CUISINES: { value: Cuisine; icon: string }[] = [
  { value: '中餐', icon: '🥢' },
  { value: '西餐', icon: '🍴' },
];

export function Home() {
  const { allDishes, history, settings, dispatch } = useAppStore();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Dish | null>(null);
  const [showResult, setShowResult] = useState(false);
  const spinTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 筛选菜品池
  const pool = allDishes.filter(
    (d) => d.mealType === settings.selectedMealType && d.cuisine === settings.selectedCuisine,
  );

  const handlePick = useCallback(() => {
    if (spinning) return;
    const picked = pickRandomDish(pool, history, settings.noRepeat, settings.noRepeatCount);
    if (!picked) return;

    setResult(picked);
    setShowResult(false);
    setSpinning(true);

    // 老虎机模式：2.5s 滚动 + 0.4s 定格 = 2.9s
    if (settings.animationMode === 'slot') {
      if (spinTimerRef.current) clearTimeout(spinTimerRef.current);
      spinTimerRef.current = setTimeout(() => {
        setSpinning(false);
        setShowResult(true);
        dispatch({ type: 'ADD_HISTORY', dish: picked });
      }, 2900);
    }
    // 转盘模式由 Wheel 组件的 onSpinEnd 回调处理
  }, [spinning, pool, history, settings.noRepeat, settings.noRepeatCount, settings.animationMode, dispatch]);

  // 转盘结束回调
  const handleWheelEnd = useCallback(() => {
    if (!spinning) return;
    setSpinning(false);
    setShowResult(true);
    if (result) {
      dispatch({ type: 'ADD_HISTORY', dish: result });
    }
  }, [spinning, result, dispatch]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (spinTimerRef.current) clearTimeout(spinTimerRef.current);
    };
  }, []);

  const handleReroll = () => {
    setShowResult(false);
    setResult(null);
    setTimeout(() => handlePick(), 100);
  };

  const handleConfirm = () => {
    setShowResult(false);
    setResult(null);
  };

  return (
    <div className="page active">
      {/* Header */}
      <div className="home-header">
        <div className="home-logo">
          <div className="logo-icon">🍽️</div>
          <div className="home-title">今天吃什么</div>
        </div>
        <div className="mode-toggle">
          <button
            className={settings.animationMode === 'slot' ? 'active' : ''}
            onClick={() => dispatch({ type: 'UPDATE_SETTINGS', patch: { animationMode: 'slot' as AnimationMode } })}
          >
            🎰
          </button>
          <button
            className={settings.animationMode === 'wheel' ? 'active' : ''}
            onClick={() => dispatch({ type: 'UPDATE_SETTINGS', patch: { animationMode: 'wheel' as AnimationMode } })}
          >
            🎡
          </button>
        </div>
      </div>

      {/* 筛选区 */}
      <div className="filter-section">
        <div className="filter-label">用餐类型</div>
        <div className="filter-row">
          {MEAL_TYPES.map((mt) => (
            <button
              key={mt.value}
              className={`filter-chip ${settings.selectedMealType === mt.value ? 'active' : ''}`}
              onClick={() => dispatch({ type: 'UPDATE_SETTINGS', patch: { selectedMealType: mt.value } })}
            >
              {mt.icon} {mt.value}
            </button>
          ))}
        </div>
        <div className="filter-label">菜系偏好</div>
        <div className="filter-row">
          {CUISINES.map((c) => (
            <button
              key={c.value}
              className={`filter-chip ${settings.selectedCuisine === c.value ? 'active' : ''}`}
              onClick={() => dispatch({ type: 'UPDATE_SETTINGS', patch: { selectedCuisine: c.value } })}
            >
              {c.icon} {c.value}
            </button>
          ))}
        </div>
      </div>

      {/* 动画区 */}
      <div className="slot-area" style={{ display: settings.animationMode === 'slot' ? 'flex' : 'none' }}>
        <SlotMachine dishes={pool} spinning={spinning} result={showResult ? result : null} />
        {!showResult && (
          <button className="pick-btn" onClick={handlePick} disabled={spinning || pool.length === 0}>
            {spinning ? '🎲 选取中...' : pool.length === 0 ? '暂无菜品' : '🎲 帮我选！'}
          </button>
        )}
        {showResult && result && (
          <div className="result-card show">
            <div className="result-emoji">{result.emoji}</div>
            <div className="result-name">{result.name}</div>
            <div className="result-desc">{result.description}</div>
            <div className="result-actions">
              <button className="btn-sm secondary" onClick={handleReroll}>🔄 换一个</button>
              <button className="btn-sm primary" onClick={handleConfirm}>✅ 就吃这个</button>
            </div>
          </div>
        )}
      </div>

      <div className="wheel-area" style={{ display: settings.animationMode === 'wheel' ? 'flex' : 'none' }}>
        <Wheel dishes={pool} spinning={spinning} result={result} onSpinEnd={handleWheelEnd} />
        {!showResult && (
          <button className="pick-btn" onClick={handlePick} disabled={spinning || pool.length === 0}>
            {spinning ? '🎲 选取中...' : pool.length === 0 ? '暂无菜品' : '🎲 帮我选！'}
          </button>
        )}
        {showResult && result && (
          <div className="result-card show">
            <div className="result-emoji">{result.emoji}</div>
            <div className="result-name">{result.name}</div>
            <div className="result-desc">{result.description}</div>
            <div className="result-actions">
              <button className="btn-sm secondary" onClick={handleReroll}>🔄 换一个</button>
              <button className="btn-sm primary" onClick={handleConfirm}>✅ 就吃这个</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
