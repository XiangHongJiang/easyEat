import type { MealType, Cuisine } from '@/types';

/**
 * 开发模式示例历史配置
 *
 * 每条记录必须指定具体日期（year/month/day）
 * daysAgo 仅供注释参考，实际不使用
 *
 * 实际菜品会从 BUILT_IN_DISHES 中自动匹配
 * 分钟数随机生成，id 自动生成
 *
 * 👇 直接编辑下方数组即可增删示例数据
 */
export interface DemoHistoryItem {
  /** 具体日期（必填） */
  date: { year: number; month: number; day: number };
  /** 小时（0-23） */
  hour: number;
  /** 用餐类型 */
  mealType: MealType;
  /** 菜系 */
  cuisine: Cuisine;
}

export const DEMO_HISTORY_CONFIG: DemoHistoryItem[] = [
  // ===== 9月4日（今天） =====
  { date: { year: 2026, month: 9, day: 4 }, hour: 8,  mealType: '早餐', cuisine: '中餐' },
  { date: { year: 2026, month: 9, day: 4 }, hour: 12, mealType: '午餐', cuisine: '中餐' },
  { date: { year: 2026, month: 9, day: 4 }, hour: 19, mealType: '晚餐', cuisine: '中餐' },

  // ===== 9月3日（昨天） =====
  { date: { year: 2026, month: 9, day: 3 }, hour: 7,  mealType: '早餐', cuisine: '西餐' },
  { date: { year: 2026, month: 9, day: 3 }, hour: 12, mealType: '午餐', cuisine: '西餐' },
  { date: { year: 2026, month: 9, day: 3 }, hour: 18, mealType: '晚餐', cuisine: '西餐' },

  // ===== 9月2日（前天） =====
  { date: { year: 2026, month: 9, day: 2 }, hour: 9,  mealType: '早餐', cuisine: '中餐' },
  { date: { year: 2026, month: 9, day: 2 }, hour: 13, mealType: '午餐', cuisine: '中餐' },
  { date: { year: 2026, month: 9, day: 2 }, hour: 20, mealType: '晚餐', cuisine: '西餐' },

  // ===== 9月1日 =====
  { date: { year: 2026, month: 9, day: 1 }, hour: 8,  mealType: '早餐', cuisine: '西餐' },
  { date: { year: 2026, month: 9, day: 1 }, hour: 12, mealType: '午餐', cuisine: '西餐' },
  { date: { year: 2026, month: 9, day: 1 }, hour: 19, mealType: '晚餐', cuisine: '中餐' },

  // ===== 8月30日 =====
  { date: { year: 2026, month: 8, day: 30 }, hour: 12, mealType: '午餐', cuisine: '中餐' },
  { date: { year: 2026, month: 8, day: 30 }, hour: 19, mealType: '晚餐', cuisine: '西餐' },

  // ===== 8月28日 =====
  { date: { year: 2026, month: 8, day: 28 }, hour: 7,  mealType: '早餐', cuisine: '中餐' },
  { date: { year: 2026, month: 8, day: 28 }, hour: 18, mealType: '晚餐', cuisine: '中餐' },

  // ===== 8月20日 =====
  { date: { year: 2026, month: 8, day: 20 }, hour: 12, mealType: '午餐', cuisine: '西餐' },
  { date: { year: 2026, month: 8, day: 20 }, hour: 19, mealType: '晚餐', cuisine: '西餐' },

  // ===== 8月15日 =====
  { date: { year: 2026, month: 8, day: 15 }, hour: 12, mealType: '午餐', cuisine: '中餐' },

  // ===== 8月10日 =====
  { date: { year: 2026, month: 8, day: 10 }, hour: 19, mealType: '晚餐', cuisine: '中餐' },

  // ===== 8月5日 =====
  { date: { year: 2026, month: 8, day: 5 }, hour: 12, mealType: '午餐', cuisine: '西餐' },
];
