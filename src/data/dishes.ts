import type { Dish } from '@/types';

/** 内置精选菜品库 */
export const BUILT_IN_DISHES: Dish[] = [
  // ===== 中餐 · 早餐 =====
  { id: 'b001', name: '茶叶蛋 + 豆浆', mealType: '早餐', cuisine: '中餐', emoji: '🥚', description: '经典中式早餐，暖胃又暖心', builtIn: true },
  { id: 'b002', name: '小笼包', mealType: '早餐', cuisine: '中餐', emoji: '🥟', description: '皮薄馅多，一口一个鲜', builtIn: true },
  { id: 'b003', name: '油条 + 豆浆', mealType: '早餐', cuisine: '中餐', emoji: '🥖', description: '金黄酥脆，国民早餐CP', builtIn: true },
  { id: 'b004', name: '皮蛋瘦肉粥', mealType: '早餐', cuisine: '中餐', emoji: '🍚', description: '绵密暖胃，元气满满', builtIn: true },
  { id: 'b005', name: '煎饼果子', mealType: '早餐', cuisine: '中餐', emoji: '🥞', description: '薄脆加蛋，街头美味', builtIn: true },
  { id: 'b006', name: '手抓饼', mealType: '早餐', cuisine: '中餐', emoji: '🫓', description: '层层酥脆，加蛋加肠', builtIn: true },

  // ===== 中餐 · 午餐 =====
  { id: 'b010', name: '黄焖鸡米饭', mealType: '午餐', cuisine: '中餐', emoji: '🥘', description: '浓郁酱汁拌饭，打工人的快乐源泉', builtIn: true },
  { id: 'b011', name: '兰州拉面', mealType: '午餐', cuisine: '中餐', emoji: '🍜', description: '热气腾腾，一清二白三红', builtIn: true },
  { id: 'b012', name: '麻辣香锅', mealType: '午餐', cuisine: '中餐', emoji: '🍲', description: '麻辣鲜香，想吃什么夹什么', builtIn: true },
  { id: 'b013', name: '宫保鸡丁', mealType: '午餐', cuisine: '中餐', emoji: '🥡', description: '花生鸡丁，甜辣下饭', builtIn: true },
  { id: 'b014', name: '番茄炒蛋盖饭', mealType: '午餐', cuisine: '中餐', emoji: '🍅', description: '酸甜开胃，家常味道', builtIn: true },
  { id: 'b015', name: '手工水饺', mealType: '午餐', cuisine: '中餐', emoji: '🥟', description: '皮薄馅大，蘸醋更香', builtIn: true },
  { id: 'b016', name: '重庆小面', mealType: '午餐', cuisine: '中餐', emoji: '🍜', description: '麻辣鲜香，一碗不够', builtIn: true },
  { id: 'b017', name: '蛋炒饭', mealType: '午餐', cuisine: '中餐', emoji: '🍚', description: '粒粒分明，简单美味', builtIn: true },

  // ===== 中餐 · 晚餐 =====
  { id: 'b020', name: '火锅', mealType: '晚餐', cuisine: '中餐', emoji: '🍲', description: '涮起来！聚会首选', builtIn: true },
  { id: 'b021', name: '酸菜鱼', mealType: '晚餐', cuisine: '中餐', emoji: '🐟', description: '酸辣鲜香，鱼肉嫩滑', builtIn: true },
  { id: 'b022', name: '红烧肉', mealType: '晚餐', cuisine: '中餐', emoji: '🥩', description: '肥而不腻，入口即化', builtIn: true },
  { id: 'b023', name: '麻婆豆腐', mealType: '晚餐', cuisine: '中餐', emoji: '🫘', description: '麻辣鲜香，超级下饭', builtIn: true },
  { id: 'b024', name: '糖醋排骨', mealType: '晚餐', cuisine: '中餐', emoji: '🍖', description: '酸甜适口，啃骨头快乐', builtIn: true },
  { id: 'b025', name: '烤鸭', mealType: '晚餐', cuisine: '中餐', emoji: '🦆', description: '皮脆肉嫩，蘸酱卷饼', builtIn: true },

  // ===== 西餐 · 早餐 =====
  { id: 'b030', name: '三明治', mealType: '早餐', cuisine: '西餐', emoji: '🥪', description: '简单快手，营养均衡', builtIn: true },
  { id: 'b031', name: '可颂面包', mealType: '早餐', cuisine: '西餐', emoji: '🥐', description: '层层酥脆，黄油香浓', builtIn: true },
  { id: 'b032', name: '美式早餐', mealType: '早餐', cuisine: '西餐', emoji: '🍳', description: '蛋+培根+吐司，能量满满', builtIn: true },

  // ===== 西餐 · 午餐 =====
  { id: 'b040', name: '日式便当', mealType: '午餐', cuisine: '西餐', emoji: '🍱', description: '荤素搭配，精致好看', builtIn: true },
  { id: 'b041', name: '意大利面', mealType: '午餐', cuisine: '西餐', emoji: '🍝', description: '弹牙意面配浓郁酱汁', builtIn: true },
  { id: 'b042', name: '咖喱饭', mealType: '午餐', cuisine: '西餐', emoji: '🍛', description: '浓郁咖喱，拌饭一绝', builtIn: true },
  { id: 'b043', name: '汉堡', mealType: '午餐', cuisine: '西餐', emoji: '🍔', description: '多汁肉饼，大口满足', builtIn: true },
  { id: 'b044', name: '披萨', mealType: '午餐', cuisine: '西餐', emoji: '🍕', description: '芝士拉丝，快乐加倍', builtIn: true },
  { id: 'b045', name: '牛排', mealType: '午餐', cuisine: '西餐', emoji: '🥩', description: '外焦里嫩，汁水丰盈', builtIn: true },

  // ===== 西餐 · 晚餐 =====
  { id: 'b050', name: '烤鸡', mealType: '晚餐', cuisine: '西餐', emoji: '🍗', description: '皮脆肉嫩，香气四溢', builtIn: true },
  { id: 'b051', name: '海鲜意面', mealType: '晚餐', cuisine: '西餐', emoji: '🍤', description: '鲜味十足，海洋的味道', builtIn: true },
  { id: 'b052', name: '墨西哥卷饼', mealType: '晚餐', cuisine: '西餐', emoji: '🌮', description: '馅料丰富，一口满足', builtIn: true },
  { id: 'b053', name: '奶油蘑菇汤', mealType: '晚餐', cuisine: '西餐', emoji: '🍄', description: '浓郁顺滑，暖身暖胃', builtIn: true },
];

/** 可选 emoji 列表（添加菜品时用） */
export const EMOJI_OPTIONS = [
  '🥘', '🍜', '🍲', '🍱', '🥟', '🍝', '🍛', '🥩',
  '🍕', '🍔', '🥪', '🌮', '🍗', '🍤', '🍄', '🐟',
  '🦆', '🍖', '🫘', '🍚', '🍅', '🥡', '🥞', '🫓',
  '🥐', '🍳', '🥖', '🥚',
];
