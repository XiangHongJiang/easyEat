import type { HistoryEntry, HistoryFilter } from '@/types';

/** 将时间戳格式化为 HH:MM */
export function formatTime(ts: number): string {
  const d = new Date(ts);
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/** 格式化年月为 YYYY-MM（month 0-indexed 输入，输出 1-indexed 补零） */
export function formatYearMonth(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

/** 判断时间戳是否属于指定年月（month 0-indexed） */
export function isSameMonth(ts: number, year: number, month: number): boolean {
  const d = new Date(ts);
  return d.getFullYear() === year && d.getMonth() === month;
}

/** 获取日期标签：今天/昨天/前天/M月D日 */
export function formatDateLabel(ts: number): string {
  const now = new Date();
  const date = new Date(ts);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dayMs = 86400000;

  if (ts >= todayStart) return '今天';
  if (ts >= todayStart - dayMs) return '昨天';
  if (ts >= todayStart - dayMs * 2) return '前天';

  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

/** 获取日期标签（带完整日期，用于近一月视图） */
export function formatDateLabelFull(ts: number): string {
  const now = new Date();
  const date = new Date(ts);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 86400000;

  if (ts >= todayStart) return `今天 ${date.getMonth() + 1}月${date.getDate()}日`;
  if (ts >= yesterdayStart) return '昨天';

  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

/** 按日期分组历史记录（可自定义日期标签格式化函数） */
export function groupByDate(
  entries: HistoryEntry[],
  labelFn: (ts: number) => string = formatDateLabel,
): { date: string; items: HistoryEntry[] }[] {
  const groups: Record<string, HistoryEntry[]> = {};
  for (const entry of entries) {
    const label = labelFn(entry.timestamp);
    if (!groups[label]) groups[label] = [];
    groups[label].push(entry);
  }
  return Object.entries(groups).map(([date, items]) => ({ date, items }));
}

/** 按筛选范围过滤历史 */
export function filterHistory(entries: HistoryEntry[], filter: HistoryFilter): HistoryEntry[] {
  if (filter === 'all') return entries;

  const now = Date.now();
  const weekMs = 7 * 86400000;
  const monthMs = 30 * 86400000;

  if (filter === 'threeDays') {
    return entries.filter((e) => now - e.timestamp <= 3 * 86400000);
  }
  if (filter === 'week') {
    return entries.filter((e) => now - e.timestamp <= weekMs);
  }
  if (filter === 'month') {
    return entries.filter((e) => now - e.timestamp <= monthMs);
  }
  return entries;
}

/** 获取"最近一次"的相对时间描述 */
export function formatLastTime(ts: number): string {
  const now = new Date();
  const date = new Date(ts);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 86400000;

  const time = formatTime(ts);
  if (ts >= todayStart) return `今天\n${time}`;
  if (ts >= yesterdayStart) return `昨天\n${time}`;

  return `${date.getMonth() + 1}月${date.getDate()}日\n${time}`;
}
