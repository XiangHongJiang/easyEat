import { useState } from 'react';
import { useAppStore } from '@/store/AppStore';
import { AddDishModal } from '@/components/AddDishModal';
import type { AnimationMode } from '@/types';

export function Settings() {
  const { customDishes, settings, dispatch } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddDish = (dish: typeof customDishes[number]) => {
    dispatch({ type: 'ADD_DISH', dish });
    setShowAddModal(false);
  };

  const handleRemoveDish = (id: string) => {
    dispatch({ type: 'REMOVE_DISH', id });
  };

  const handleClearCustom = () => {
    if (confirm('确定清空所有自定义菜品吗？')) {
      dispatch({ type: 'CLEAR_CUSTOM_DISHES' });
    }
  };

  const handleResetAll = () => {
    if (confirm('确定重置所有数据吗？这将清空历史、自定义菜品和设置。')) {
      dispatch({ type: 'RESET_ALL' });
    }
  };

  const adjustNoRepeat = (delta: number) => {
    const next = Math.max(1, Math.min(10, settings.noRepeatCount + delta));
    dispatch({ type: 'UPDATE_SETTINGS', patch: { noRepeatCount: next } });
  };

  return (
    <div className="page active">
      {/* Header */}
      <div className="settings-header">
        <div className="settings-title">⚙️ 设置</div>
      </div>

      <div className="settings-list">
        {/* 动画模式 */}
        <div className="settings-section">
          <div className="settings-section-title">动画模式</div>
          <div className="settings-card">
            <div className="settings-row">
              <span className="s-label">选菜动画</span>
              <div className="mode-select">
                <button
                  className={settings.animationMode === 'slot' ? 'active' : ''}
                  onClick={() => dispatch({ type: 'UPDATE_SETTINGS', patch: { animationMode: 'slot' as AnimationMode } })}
                >
                  🎰 老虎机
                </button>
                <button
                  className={settings.animationMode === 'wheel' ? 'active' : ''}
                  onClick={() => dispatch({ type: 'UPDATE_SETTINGS', patch: { animationMode: 'wheel' as AnimationMode } })}
                >
                  🎡 转盘
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 智能去重 */}
        <div className="settings-section">
          <div className="settings-section-title">智能去重</div>
          <div className="settings-card">
            <div className="settings-row">
              <span className="s-label">近期不重复</span>
              <button
                className={`toggle ${settings.noRepeat ? 'on' : ''}`}
                onClick={() => dispatch({ type: 'UPDATE_SETTINGS', patch: { noRepeat: !settings.noRepeat } })}
              />
            </div>
            <div className="settings-row">
              <span className="s-label">排除最近次数</span>
              <div className="stepper">
                <button onClick={() => adjustNoRepeat(-1)}>−</button>
                <span className="value">{settings.noRepeatCount}</span>
                <button onClick={() => adjustNoRepeat(1)}>＋</button>
              </div>
            </div>
          </div>
        </div>

        {/* 自定义菜品 */}
        <div className="settings-section">
          <div className="settings-section-title">我的菜品</div>
          <div className="settings-card" style={{ padding: '12px 16px' }}>
            <div className="dish-list">
              {customDishes.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13, padding: '8px' }}>
                  还没有自定义菜品
                </div>
              ) : (
                customDishes.map((dish) => (
                  <div className="dish-item" key={dish.id}>
                    <span className="d-emoji">{dish.emoji}</span>
                    <span className="d-name">{dish.name}</span>
                    <span className="d-cat">{dish.cuisine}</span>
                    <button className="d-delete" onClick={() => handleRemoveDish(dish.id)}>✕</button>
                  </div>
                ))
              )}
            </div>
            <button className="add-dish-btn" onClick={() => setShowAddModal(true)}>
              ＋ 添加自定义菜品
            </button>
          </div>
        </div>

        {/* 数据管理 */}
        <div className="settings-section">
          <div className="settings-section-title">数据管理</div>
          <button className="danger-btn" onClick={handleClearCustom}>🗑️ 清空自定义菜品</button>
          <button className="danger-btn" onClick={handleResetAll}>↩️ 重置所有数据</button>
        </div>
      </div>

      {/* 添加菜品弹窗 */}
      {showAddModal && (
        <AddDishModal
          onClose={() => setShowAddModal(false)}
          onConfirm={handleAddDish}
        />
      )}
    </div>
  );
}
