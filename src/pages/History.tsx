import { useState, useMemo } from 'react';
import { useAppStore } from '@/store/AppStore';
import { formatTime, formatDateLabel } from '@/utils/date';
import type { MealType, HistoryEntry } from '@/types';

const MEAL_EMOJI: Record<MealType, string> = {
  '早餐': '🌅',
  '午餐': '☀️',
  '晚餐': '🌙',
};

const MEAL_ORDER: Record<MealType, number> = {
  '晚餐': 0,
  '午餐': 1,
  '早餐': 2,
};

/** 每天每个时段只保留最新一条，按日期倒序 + 时段排序 */
function dedupeAndSort(entries: HistoryEntry[]): HistoryEntry[] {
  const map = new Map<string, HistoryEntry>();
  for (const e of entries) {
    const d = new Date(e.timestamp);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${e.dish.mealType}`;
    const existing = map.get(key);
    if (!existing || e.timestamp > existing.timestamp) {
      map.set(key, e);
    }
  }
  return Array.from(map.values()).sort((a, b) => {
    const da = new Date(a.timestamp);
    const db = new Date(b.timestamp);
    const dayA = new Date(da.getFullYear(), da.getMonth(), da.getDate()).getTime();
    const dayB = new Date(db.getFullYear(), db.getMonth(), db.getDate()).getTime();
    if (dayB !== dayA) return dayB - dayA;
    return MEAL_ORDER[a.dish.mealType] - MEAL_ORDER[b.dish.mealType];
  });
}

export function History() {
  const { history, dispatch } = useAppStore();

  // 去重 + 排序后的展示列表
  const displayList = useMemo(() => dedupeAndSort(history), [history]);

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showClearConfirm2, setShowClearConfirm2] = useState(false);

  const handleClear = () => setShowClearConfirm(true);
  const handleClearConfirm1 = () => {
    setShowClearConfirm(false);
    setShowClearConfirm2(true);
  };
  const handleClearConfirm2 = () => {
    dispatch({ type: 'CLEAR_HISTORY' });
    setShowClearConfirm2(false);
  };

  return (
    <div className="page active">
      {/* Header */}
      <div className="history-header">
        <div className="history-title">
          <span className="history-logo-icon">🗓️</span>
          吃什么了
        </div>
        {history.length > 0 && (
          <button className="clear-btn" onClick={handleClear}>🗑️ 清空</button>
        )}
      </div>

      {/* 第一次确认弹窗 */}
      {showClearConfirm && (
        <div className="modal-overlay" onClick={() => setShowClearConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <div className="modal-title">清空历史记录</div>
            <div className="modal-desc">确定要清空所有历史记录吗？此操作不可撤销。</div>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowClearConfirm(false)}>取消</button>
              <button className="modal-btn confirm" onClick={handleClearConfirm1}>继续</button>
            </div>
          </div>
        </div>
      )}

      {/* 第二次确认弹窗 */}
      {showClearConfirm2 && (
        <div className="modal-overlay" onClick={() => setShowClearConfirm2(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">🚫</div>
            <div className="modal-title">再次确认</div>
            <div className="modal-desc">所有历史记录将被永久删除，确定吗？</div>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowClearConfirm2(false)}>取消</button>
              <button className="modal-btn confirm danger" onClick={handleClearConfirm2}>确认清空</button>
            </div>
          </div>
        </div>
      )}

      {/* 历史列表 */}
      {displayList.length > 0 ? (
        <div className="history-list">
          {displayList.map((entry) => (
            <div className="history-last-card" key={entry.id}>
              <div className="last-label">
                {MEAL_EMOJI[entry.dish.mealType]} {entry.dish.mealType}
              </div>
              <div className="last-content">
                <div className="last-emoji">{entry.dish.emoji}</div>
                <div className="last-info">
                  <div className="last-name">{entry.dish.name}</div>
                  <div className="last-meta">
                    {formatDateLabel(entry.timestamp)} · {entry.dish.cuisine}
                  </div>
                </div>
                <div className="last-time">{formatTime(entry.timestamp)}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <div className="empty-text">
            还没有选过菜哦<br />去首页点一下「帮我选」吧！
          </div>
        </div>
      )}
    </div>
  );
}
