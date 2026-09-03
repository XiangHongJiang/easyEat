import type { Dish, HistoryEntry } from '@/types';

/**
 * 随机选择算法
 * 从菜品池中随机选一个，排除最近N次选过的
 */
export function pickRandomDish(
  pool: Dish[],
  history: HistoryEntry[],
  noRepeat: boolean,
  noRepeatCount: number,
): Dish | null {
  if (pool.length === 0) return null;

  if (!noRepeat || noRepeatCount <= 0) {
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // 获取最近N次选过的菜品ID
  const recentIds = new Set(
    history.slice(0, noRepeatCount).map((h) => h.dish.id),
  );

  // 排除最近选过的
  const filtered = pool.filter((d) => !recentIds.has(d.id));

  // 如果排除后为空，放宽限制直接随机
  if (filtered.length === 0) {
    return pool[Math.floor(Math.random() * pool.length)];
  }

  return filtered[Math.floor(Math.random() * filtered.length)];
}

/** 生成唯一ID */
export function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
