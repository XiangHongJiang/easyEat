import type { PageRoute } from '@/types';

interface TabBarProps {
  current: PageRoute;
  onChange: (page: PageRoute) => void;
}

const TABS: { route: PageRoute; icon: string; label: string }[] = [
  { route: 'home', icon: '🏠', label: '首页' },
  { route: 'history', icon: '📋', label: '历史' },
  { route: 'settings', icon: '⚙️', label: '设置' },
];

export function TabBar({ current, onChange }: TabBarProps) {
  return (
    <nav className="tabbar">
      {TABS.map((tab) => (
        <button
          key={tab.route}
          className={`tabbar-item ${current === tab.route ? 'active' : ''}`}
          onClick={() => onChange(tab.route)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
