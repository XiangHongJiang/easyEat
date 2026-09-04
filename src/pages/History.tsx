import { useState, useMemo } from 'react';
import { useAppStore } from '@/store/AppStore';
import { formatTime, formatDateLabel, formatYearMonth, isSameMonth } from '@/utils/date';
import type { MealType, HistoryEntry } from '@/types';

const isDev = import.meta.env.DEV;

const MEAL_EMOJI: Record<MealType, string> = {
  '早餐': '🌅',
  '午餐': '☀️',
  '晚餐': '🌙',
};

/** 时段排序：晚餐 → 午餐 → 早餐 */
const MEAL_ORDER: Record<MealType, number> = {
  '晚餐': 0,
  '午餐': 1,
  '早餐': 2,
};

/** 每天每个时段只保留最新一条 */
function dedupe(entries: HistoryEntry[]): HistoryEntry[] {
  const map = new Map<string, HistoryEntry>();
  for (const e of entries) {
    const d = new Date(e.timestamp);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${e.dish.mealType}`;
    const existing = map.get(key);
    if (!existing || e.timestamp > existing.timestamp) {
      map.set(key, e);
    }
  }
  return Array.from(map.values());
}

/** 按日期分组，日期内按时段排序 */
interface DateGroup {
  dateLabel: string;
  isToday: boolean;
  items: HistoryEntry[];
}

function groupByDate(entries: HistoryEntry[]): DateGroup[] {
  const deduped = dedupe(entries);
  const groups = new Map<number, HistoryEntry[]>();

  const todayKey = new Date();
  const todayStart = new Date(todayKey.getFullYear(), todayKey.getMonth(), todayKey.getDate()).getTime();

  for (const e of deduped) {
    const d = new Date(e.timestamp);
    const dayKey = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    if (!groups.has(dayKey)) groups.set(dayKey, []);
    groups.get(dayKey)!.push(e);
  }

  return Array.from(groups.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([dayKey, items]) => ({
      dateLabel: formatDateLabel(dayKey),
      isToday: dayKey === todayStart,
      items: items.sort((a, b) => MEAL_ORDER[a.dish.mealType] - MEAL_ORDER[b.dish.mealType]),
    }));
}

/** 获取有数据的年月集合 */
function getMonthsWithData(entries: HistoryEntry[]): Set<string> {
  const set = new Set<string>();
  for (const e of entries) {
    const d = new Date(e.timestamp);
    set.add(formatYearMonth(d.getFullYear(), d.getMonth()));
  }
  return set;
}

export function History() {
  const { history, dispatch } = useAppStore();

  // 当前查看的年月（0-indexed month）
  const now = new Date();
  const [viewDate, setViewDate] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [pickerYear, setPickerYear] = useState(now.getFullYear());

  // 有数据的月份集合
  const monthsWithData = useMemo(() => getMonthsWithData(history), [history]);

  // 当前查看月份的历史记录
  const monthHistory = useMemo(
    () => history.filter((e) => isSameMonth(e.timestamp, viewDate.year, viewDate.month)),
    [history, viewDate],
  );

  // 按日期分组
  const dateGroups = useMemo(() => groupByDate(monthHistory), [monthHistory]);

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

  const handleMonthSelect = (month: number) => {
    setViewDate({ year: pickerYear, month });
    setShowMonthPicker(false);
  };

  const isCurrentMonth = (month: number) =>
    pickerYear === now.getFullYear() && month === now.getMonth();

  return (
    <div className="page active">
      {/* Header */}
      <div className="history-header">
        <div
          className="month-picker-trigger"
          onClick={() => {
            setPickerYear(viewDate.year);
            setShowMonthPicker(true);
          }}
        >
          📅 {formatYearMonth(viewDate.year, viewDate.month)}
          <span className="arrow">▼</span>
        </div>
        {history.length > 0 && (
          <button className="clear-btn" onClick={handleClear}>🗑️ 清空</button>
        )}
        {isDev && (
          <button
            className="clear-btn"
            style={{ marginLeft: 8, borderColor: 'var(--color-main)', color: 'var(--color-main)' }}
            onClick={() => dispatch({ type: 'LOAD_DEMO_HISTORY' })}
          >📋 示例数据</button>
        )}
      </div>

      {/* 月份选择器弹窗 */}
      {showMonthPicker && (
        <div className="modal-overlay" onClick={() => setShowMonthPicker(false)}>
          <div className="modal-content month-picker" onClick={(e) => e.stopPropagation()}>
            <div className="month-picker-header">
              <button
                className="month-picker-year-btn"
                onClick={() => setPickerYear((y) => y - 1)}
              >‹</button>
              <div className="month-picker-year">{pickerYear}</div>
              <button
                className="month-picker-year-btn"
                onClick={() => setPickerYear((y) => y + 1)}
              >›</button>
            </div>
            <div className="month-picker-grid">
              {Array.from({ length: 12 }, (_, i) => i).map((month) => {
                const isActive = pickerYear === viewDate.year && month === viewDate.month;
                const hasData = monthsWithData.has(formatYearMonth(pickerYear, month));
                const isToday = isCurrentMonth(month);
                return (
                  <div
                    key={month}
                    className={`month-picker-month${isActive ? ' active' : ''}`}
                    onClick={() => handleMonthSelect(month)}
                  >
                    {isToday && <span className="today-mark">今</span>}
                    {month + 1}月
                    {hasData && <span className="dot" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

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

      {/* 历史列表 - 按日期分组 */}
      {dateGroups.length > 0 ? (
        <div className="history-list">
          {dateGroups.map((group) => (
            <div className={`history-date-group${group.isToday ? ' is-today' : ' is-past'}`} key={group.dateLabel}>
              <div className="history-date-label">{group.dateLabel}</div>
              {group.items.map((entry) => (
                <div className="history-last-card" key={entry.id}>
                  <div className="last-label">
                    {MEAL_EMOJI[entry.dish.mealType]} {entry.dish.mealType}
                  </div>
                  <div className="last-content">
                    <div className="last-emoji">{entry.dish.emoji}</div>
                    <div className="last-info">
                      <div className="last-name">{entry.dish.name}</div>
                      <div className="last-meta">{entry.dish.cuisine}</div>
                    </div>
                    <div className="last-time">{formatTime(entry.timestamp)}</div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-text">
            {history.length === 0
              ? <>还没有选过菜哦<br />去首页点一下「帮我选」吧！</>
              : <>该月份暂无记录<br />切换到其他月份看看吧</>
            }
          </div>
        </div>
      )}
    </div>
  );
}
