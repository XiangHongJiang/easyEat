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

function ResultCard({ result, onReroll }: {
  result: Dish;
  onReroll: () => void;
}) {
  return (
    <div className="result-card show">
      <div className="result-emoji">{result.emoji}</div>
      <div className="result-name">{result.name}</div>
      <div className="result-desc">{result.description}</div>
      <div className="result-actions">
        <button className="btn-sm secondary" onClick={onReroll}>不喜欢，换一个</button>
      </div>
    </div>
  );
}

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
    // 转盘模式只从前8个菜品中选（转盘最多显示8个扇形）
    const pickPool = settings.animationMode === 'wheel' ? pool.slice(0, 8) : pool;
    // noRepeat 按当前用餐类型过滤历史，避免跨时段去重失效
    const sameTypeHistory = history.filter((h) => h.dish.mealType === settings.selectedMealType);
    const picked = pickRandomDish(pickPool, sameTypeHistory, settings.noRepeat, settings.noRepeatCount);
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
  }, [spinning, pool, history, settings.noRepeat, settings.noRepeatCount, settings.animationMode, settings.selectedMealType, dispatch, pickRandomDish]);

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

  // 切换用餐类型或菜系时：如果今天已选过该组合，恢复结果；否则重置
  useEffect(() => {
    if (spinTimerRef.current) clearTimeout(spinTimerRef.current);
    setSpinning(false);

    // 查找今天该用餐类型+菜系的历史记录
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayMs = todayStart.getTime();
    const todayEntry = history.find(
      (e) =>
        e.timestamp >= todayMs &&
        e.dish.mealType === settings.selectedMealType &&
        e.dish.cuisine === settings.selectedCuisine,
    );

    if (todayEntry) {
      setResult(todayEntry.dish);
      setShowResult(true);
    } else {
      setResult(null);
      setShowResult(false);
    }
  }, [settings.selectedMealType, settings.selectedCuisine, history]);

  const handleReroll = () => {
    setShowResult(false);
    setResult(null);
    setTimeout(() => handlePick(), 100);
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
            aria-label="老虎机模式"
            className={settings.animationMode === 'slot' ? 'active' : ''}
            onClick={() => dispatch({ type: 'UPDATE_SETTINGS', patch: { animationMode: 'slot' as AnimationMode } })}
          >
            🎰
          </button>
          <button
            aria-label="转盘模式"
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
        {pool.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🍽️</div>
            <div className="empty-text">该筛选条件下暂无菜品<br />试试更换用餐类型或菜系</div>
          </div>
        ) : (
          <>
            <div className="slot-machine-wrapper">
              {!showResult && (
                <SlotMachine dishes={pool} spinning={spinning} result={showResult ? result : null} />
              )}
              {showResult && result && (
                <ResultCard result={result} onReroll={handleReroll} />
              )}
            </div>
            {!showResult && (
              <button className="pick-btn" onClick={handlePick} disabled={spinning}>
                {spinning ? '🎲 选取中...' : '🎲 帮我选！'}
              </button>
            )}
          </>
        )}
      </div>

      <div className="wheel-area" style={{ display: settings.animationMode === 'wheel' ? 'flex' : 'none' }}>
        {pool.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🍽️</div>
            <div className="empty-text">该筛选条件下暂无菜品<br />试试更换用餐类型或菜系</div>
          </div>
        ) : (
          <>
            <div className="wheel-machine-wrapper">
              {!showResult && (
                <Wheel dishes={pool} spinning={spinning} result={result} onSpinEnd={handleWheelEnd} />
              )}
              {showResult && result && (
                <ResultCard result={result} onReroll={handleReroll} />
              )}
            </div>
            {!showResult && (
              <button className="pick-btn" onClick={handlePick} disabled={spinning}>
                {spinning ? '🎲 选取中...' : '🎲 帮我选！'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
