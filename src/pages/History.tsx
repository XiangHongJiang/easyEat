import { useState, useMemo } from 'react';
import { useAppStore } from '@/store/AppStore';
import { filterHistory, groupByDate, formatTime, formatLastTime, formatDateLabelFull } from '@/utils/date';
import type { HistoryFilter } from '@/types';

const FILTERS: { value: HistoryFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'week', label: '近一周' },
  { value: 'month', label: '近一月' },
];

export function History() {
  const { history, dispatch } = useAppStore();
  const [filter, setFilter] = useState<HistoryFilter>('all');
  const [expanded, setExpanded] = useState(false);

  // 筛选后的历史
  const filtered = useMemo(() => filterHistory(history, filter), [history, filter]);

  // 最近一次
  const lastEntry = filtered.length > 0 ? filtered[0] : null;

  // 分组（排除最近一次，因为它单独展示）
  const grouped = useMemo(() => {
    if (!expanded) return [];
    const rest = filtered.slice(1);
    return groupByDate(rest);
  }, [filtered, expanded]);

  // 近一月模式用完整日期标签
  const groupedDisplay = useMemo(() => {
    if (filter === 'month') {
      // 重新分组用完整日期
      const rest = filtered.slice(1);
      const groups: Record<string, typeof rest> = {};
      for (const entry of rest) {
        const label = formatDateLabelFull(entry.timestamp);
        if (!groups[label]) groups[label] = [];
        groups[label].push(entry);
      }
      return Object.entries(groups).map(([date, items]) => ({ date, items }));
    }
    return grouped;
  }, [filtered, filter, grouped]);

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

      {filtered.length === 0 ? (
        /* 空状态 */
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <div className="empty-text">
            还没有选过菜哦<br />
            去首页点一下「帮我选」吧！
          </div>
        </div>
      ) : (
        <>
          {/* 最近一次卡片 */}
          {lastEntry && (
            <div className="history-last-card">
              <div className="last-label">🕐 最近一次</div>
              <div className="last-content">
                <div className="last-emoji">{lastEntry.dish.emoji}</div>
                <div className="last-info">
                  <div className="last-name">{lastEntry.dish.name}</div>
                  <div className="last-meta">
                    {lastEntry.dish.cuisine} · {lastEntry.dish.mealType}
                  </div>
                </div>
                <div className="last-time">
                  {formatLastTime(lastEntry.timestamp)}
                </div>
              </div>
            </div>
          )}

          {/* 展开提示 */}
          {filtered.length > 1 && (
            <button
              className={`history-expand-hint ${expanded ? 'expanded' : ''}`}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? '收起历史' : '查看更多历史'}
              <span className="arrow">▼</span>
            </button>
          )}

          {/* 历史列表（可折叠） */}
          {expanded && groupedDisplay.length > 0 && (
            <div className="history-list-collapsible">
              {groupedDisplay.map((group) => (
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
