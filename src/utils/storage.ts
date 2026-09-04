/** localStorage 封装工具 */

const PREFIX = 'eatsoeasy:';

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // 存储失败静默处理
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // 忽略
  }
}

/** localStorage key 常量 */
export const STORAGE_KEYS = {
  customDishes: 'customDishes',
  removedDishIds: 'removedDishIds',
  history: 'history',
  settings: 'settings',
} as const;
