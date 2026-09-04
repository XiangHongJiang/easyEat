/** 菜品数据结构 */
export interface Dish {
  /** 唯一ID */
  id: string;
  /** 菜名 */
  name: string;
  /** 用餐类型：早餐/午餐/晚餐 */
  mealType: MealType;
  /** 菜系偏好：中餐/西餐 */
  cuisine: Cuisine;
  /** 图标 emoji */
  emoji: string;
  /** 一句话推荐语 */
  description: string;
  /** 是否内置菜品 */
  builtIn: boolean;
}

/** 用餐类型 */
export type MealType = '早餐' | '午餐' | '晚餐';

/** 菜系偏好 */
export type Cuisine = '中餐' | '西餐';

/** 历史记录条目 */
export interface HistoryEntry {
  /** 唯一ID */
  id: string;
  /** 关联的菜品快照 */
  dish: Dish;
  /** 选择时间戳 */
  timestamp: number;
}

/** 应用设置 */
export interface Settings {
  /** 动画模式 */
  animationMode: AnimationMode;
  /** 是否启用近期不重复 */
  noRepeat: boolean;
  /** 排除最近N次 */
  noRepeatCount: number;
  /** 选中的用餐类型 */
  selectedMealType: MealType;
  /** 选中的菜系偏好 */
  selectedCuisine: Cuisine;
}

/** 动画模式 */
export type AnimationMode = 'slot' | 'wheel';

/** 历史筛选范围 */
export type HistoryFilter = 'threeDays' | 'week' | 'month' | 'all';

/** 页面路由 */
export type PageRoute = 'home' | 'history' | 'dishes';
