import { useAppStore } from '@/store/AppStore';
import type { AnimationMode } from '@/types';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { settings, dispatch } = useAppStore();

  const adjustNoRepeat = (delta: number) => {
    const next = Math.max(1, Math.min(10, settings.noRepeatCount + delta));
    dispatch({ type: 'UPDATE_SETTINGS', patch: { noRepeatCount: next } });
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-title">⚙️ 设置</div>

        {/* 动画模式 */}
        <div className="form-group">
          <label className="form-label">动画模式</label>
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

        {/* 智能去重 */}
        <div className="form-group">
          <label className="form-label">智能去重</label>
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

        {/* 数据管理 */}
        <div className="form-group">
          <label className="form-label">数据管理</label>
          <button className="danger-btn" onClick={handleClearCustom}>🗑️ 清空自定义菜品</button>
          <button className="danger-btn" onClick={handleResetAll}>↩️ 重置所有数据</button>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>关闭</button>
        </div>
      </div>
    </div>
  );
}
