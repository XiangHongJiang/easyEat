import { useState, useMemo, useEffect } from 'react';
import { useAppStore } from '@/store/AppStore';
import { filterHistory, groupByDate, formatTime, formatDateLabel, formatDateLabelFull } from '@/utils/date';
import type { HistoryFilter, MealType } from '@/types';

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

const FILTERS: { value: HistoryFilter; label: string }[] = [
  { value: 'threeDays', label: '近3天' },
  { value: 'week', label: '近一周' },
  { value: 'month', label: '近一月' },
  { value: 'all', label: '全部' },
];

export function History() {
  const { history, dispatch } = useAppStore();
  const [filter, setFilter] = useState<HistoryFilter>('threeDays');
  const [expanded, setExpanded] = useState(false);
  // 默认今日日期
  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // 日历选中某天：只展示该日记录
  const dateFiltered = useMemo(() => {
    if (!selectedDate) return null;
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dayStart = new Date(y, m - 1, d).getTime();
    const dayEnd = dayStart + 86400000;
    const items = history
      .filter((e) => e.timestamp >= dayStart && e.timestamp < dayEnd)
      .sort((a, b) => MEAL_ORDER[a.dish.mealType] - MEAL_ORDER[b.dish.mealType]);
    return items;
  }, [history, selectedDate]);

  // 筛选后的历史
  const filtered = useMemo(() => filterHistory(history, filter), [history, filter]);

  // 按日期分组（每组内按 晚餐→午餐→早餐 排序）
  const grouped = useMemo(() => {
    const labelFn = filter === 'month' ? formatDateLabelFull : formatDateLabel;
    const groups = groupByDate(filtered, labelFn);
    for (const g of groups) {
      g.items.sort((a, b) => MEAL_ORDER[a.dish.mealType] - MEAL_ORDER[b.dish.mealType]);
    }
    return groups;
  }, [filtered, filter]);

  // 最近一天的记录（全部时段展示）
  const todayGroup = grouped.length > 0 ? grouped[0] : null;

  // 其余天数（折叠展示）
  const olderGroups = expanded ? grouped.slice(1) : [];

  // 切换筛选时重置展开状态
  useEffect(() => {
    setExpanded(false);
  }, [filter]);

  // 日历选择时重置展开
  useEffect(() => {
    setExpanded(false);
  }, [selectedDate]);

  const handleClear = () => {
    if (confirm('确定清空所有历史记录吗？')) {
      dispatch({ type: 'CLEAR_HISTORY' });
      setExpanded(false);
    }
  };

  return (
    <div className="page active">
      {/* Header */}
      <div className="history-header">
        <div className="history-title">📋 吃什么了</div>
        {history.length > 0 && (
          <button className="clear-btn" onClick={handleClear}>🗑️ 清空</button>
        )}
      </div>

      {/* 日期筛选 tabs */}
      <div className="history-tabs">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`history-tab ${filter === f.value ? 'active' : ''}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 日历选择器 */}
      <div className="history-date-picker">
        <label className="date-picker-trigger">
          <span className="date-picker-label">🗓️ {selectedDate.replace(/-/g, '/')}</span>
          <input
            type="date"
            className="date-picker-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>
      </div>

      {/* 日历选中某天的展示 */}
      {dateFiltered && dateFiltered.length > 0 ? (
        <div className="history-today-section">
          <div className="history-today-label">📅 {selectedDate.replace(/-/g, '/')}</div>
          {dateFiltered.map((entry) => (
            <div className="history-last-card" key={entry.id}>
              <div className="last-label">{MEAL_EMOJI[entry.dish.mealType]} {entry.dish.mealType}</div>
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
      ) : (
        /* 选中日期无记录时，展示范围筛选结果 */
        <>
        {dateFiltered && dateFiltered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🍽️</div>
            <div className="empty-text">
              这一天没有选过菜哦<br />试试选择其他日期
            </div>
          </div>
        )}
        {(!dateFiltered || dateFiltered.length === 0) && filtered.length === 0 && (history.length > 0) && (
          <div className="empty-state">
            <div className="empty-icon">🍽️</div>
            <div className="empty-text">
              该时间段内暂无记录<br />试试切换其他筛选范围
            </div>
          </div>
        )}
        {(!dateFiltered || dateFiltered.length === 0) && history.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🍽️</div>
            <div className="empty-text">
              还没有选过菜哦<br />去首页点一下「帮我选」吧！
            </div>
          </div>
        )}
        </>
      )}

      {/* 范围筛选历史（日历有记录时不展示） */}
      {(!dateFiltered || dateFiltered.length === 0) && filtered.length > 0 && (
        <>
          {/* 最近一天 - 全部时段展示 */}
          {todayGroup && (
            <div className="history-today-section">
              <div className="history-today-label">📅 {todayGroup.date}</div>
              {todayGroup.items.map((entry) => (
                <div className="history-last-card" key={entry.id}>
                  <div className="last-label">{MEAL_EMOJI[entry.dish.mealType]} {entry.dish.mealType}</div>
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
          )}

          {/* 展开提示 */}
          {grouped.length > 1 && (
            <button
              className={`history-expand-hint ${expanded ? 'expanded' : ''}`}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? '收起历史' : '查看更多历史'}
              <span className="arrow">▼</span>
            </button>
          )}

          {/* 历史列表（可折叠） */}
          {expanded && olderGroups.length > 0 && (
            <div className="history-list-collapsible">
              {olderGroups.map((group) => (
                <div className="history-group" key={group.date}>
                  <div className="history-group-date">📅 {group.date}</div>
                  {group.items.map((entry) => (
                    <div className="history-item" key={entry.id}>
                      <div className="h-emoji">{entry.dish.emoji}</div>
                      <div className="h-info">
                        <div className="h-name">{entry.dish.name}</div>
                        <div className="h-meta">
                          {entry.dish.cuisine} · {entry.dish.mealType}
                        </div>
                      </div>
                      <div className="h-time">{formatTime(entry.timestamp)}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
