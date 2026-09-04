import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import type { Dish, HistoryEntry, MealType, Settings } from '@/types';
import { BUILT_IN_DISHES } from '@/data/dishes';
import { DEMO_HISTORY_CONFIG } from '@/data/demoHistory';
import { loadJSON, saveJSON, STORAGE_KEYS } from '@/utils/storage';
import { genId } from '@/utils/randomPick';

// ========== 开发模式示例数据 ==========
function buildDemoHistory(): HistoryEntry[] {
  const dishes = BUILT_IN_DISHES;
  const pick = (mealType: MealType, cuisine: '中餐' | '西餐') =>
    dishes.find((d) => d.mealType === mealType && d.cuisine === cuisine)!;
  return DEMO_HISTORY_CONFIG.map((item) => {
    const d = new Date(item.date.year, item.date.month - 1, item.date.day, item.hour, Math.floor(Math.random() * 60));
    return { id: genId(), dish: pick(item.mealType, item.cuisine), timestamp: d.getTime() };
  });
}

/** 根据当前时间返回默认用餐类型：09:59前早餐，10:00-13:59午餐，14:00后晚餐 */
function getDefaultMealType(): MealType {
  const hour = new Date().getHours();
  if (hour < 10) return '早餐';
  if (hour < 14) return '午餐';
  return '晚餐';
}

// ========== State ==========
interface AppState {
  customDishes: Dish[];
  history: HistoryEntry[];
  settings: Settings;
}

const DEFAULT_SETTINGS: Settings = {
  animationMode: 'slot',
  noRepeat: true,
  noRepeatCount: 3,
  selectedMealType: getDefaultMealType(),
  selectedCuisine: '中餐',
};

const initialState: AppState = {
  customDishes: loadJSON(STORAGE_KEYS.customDishes, [] as Dish[]),
  history: loadJSON(STORAGE_KEYS.history, [] as HistoryEntry[]),
  settings: loadJSON(STORAGE_KEYS.settings, DEFAULT_SETTINGS),
};

// ========== Actions ==========
type Action =
  | { type: 'ADD_DISH'; dish: Dish }
  | { type: 'REMOVE_DISH'; id: string }
  | { type: 'ADD_HISTORY'; dish: Dish }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'UPDATE_SETTINGS'; patch: Partial<Settings> }
  | { type: 'CLEAR_CUSTOM_DISHES' }
  | { type: 'RESET_ALL' }
  | { type: 'LOAD_DEMO_HISTORY' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_DISH':
      return { ...state, customDishes: [...state.customDishes, action.dish] };

    case 'REMOVE_DISH':
      return { ...state, customDishes: state.customDishes.filter((d) => d.id !== action.id) };

    case 'ADD_HISTORY': {
      const entry: HistoryEntry = {
        id: genId(),
        dish: action.dish,
        timestamp: Date.now(),
      };
      // 每个时段每天只保留1条：移除今天同一时段的旧记录
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayMs = todayStart.getTime();
      const filtered = state.history.filter(
        (e) => !(e.timestamp >= todayMs && e.dish.mealType === action.dish.mealType),
      );
      return { ...state, history: [entry, ...filtered] };
    }

    case 'CLEAR_HISTORY':
      return { ...state, history: [] };

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.patch } };

    case 'CLEAR_CUSTOM_DISHES':
      return { ...state, customDishes: [] };

    case 'RESET_ALL':
      return {
        customDishes: [],
        history: [],
        settings: DEFAULT_SETTINGS,
      };

    case 'LOAD_DEMO_HISTORY':
      return { ...state, history: buildDemoHistory() };

    default:
      return state;
  }
}

// ========== Context ==========
interface AppContextValue extends AppState {
  allDishes: Dish[];
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 持久化
  useEffect(() => {
    saveJSON(STORAGE_KEYS.customDishes, state.customDishes);
  }, [state.customDishes]);

  useEffect(() => {
    saveJSON(STORAGE_KEYS.history, state.history);
  }, [state.history]);

  useEffect(() => {
    saveJSON(STORAGE_KEYS.settings, state.settings);
  }, [state.settings]);

  // 合并内置 + 自定义菜品
  const allDishes = [...BUILT_IN_DISHES, ...state.customDishes];

  return (
    <AppContext.Provider value={{ ...state, allDishes, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be used within AppProvider');
  return ctx;
}
