import { useState, useEffect } from 'react';
import { AppProvider } from '@/store/AppStore';
import { TabBar } from '@/components/TabBar';
import { Home } from '@/pages/Home';
import { History } from '@/pages/History';
import { Settings } from '@/pages/Settings';
import type { PageRoute } from '@/types';

function StatusBar() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      setTime(`${h}:${m}`);
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="status-bar">
      <span>{time}</span>
    </div>
  );
}

function AppContent() {
  const [page, setPage] = useState<PageRoute>('home');

  return (
    <>
      <StatusBar />
      {page === 'home' && <Home />}
      {page === 'history' && <History />}
      {page === 'settings' && <Settings />}
      <TabBar current={page} onChange={setPage} />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
