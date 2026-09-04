import type { PageRoute } from '@/types';

interface TabBarProps {
  current: PageRoute;
  onChange: (page: PageRoute) => void;
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path className="icon-detail" d="M12 7v5l3 2" />
    </svg>
  );
}

function DishesIcon() {
  return (
    <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11h18a9 9 0 0 1-18 0z" />
      <path className="icon-line" d="M7 7c0-1 1-2 2-2M11 7c0-1 1-2 2-2" />
      <path className="icon-line" d="M2 21h20" />
    </svg>
  );
}

const TABS: { route: PageRoute; Icon: () => JSX.Element; label: string }[] = [
  { route: 'home', Icon: HomeIcon, label: '首页' },
  { route: 'history', Icon: HistoryIcon, label: '历史' },
  { route: 'dishes', Icon: DishesIcon, label: '菜品' },
];

export function TabBar({ current, onChange }: TabBarProps) {
  return (
    <nav className="tabbar">
      {TABS.map(({ route, Icon, label }) => (
        <button
          key={route}
          className={`tabbar-item ${current === route ? 'active' : ''}`}
          onClick={() => onChange(route)}
        >
          <span className="tab-icon">
            <Icon />
          </span>
          <span className="tab-label">{label}</span>
        </button>
      ))}
    </nav>
  );
}
