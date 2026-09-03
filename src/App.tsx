import { useState } from 'react';
import { AppProvider } from '@/store/AppStore';
import { TabBar } from '@/components/TabBar';
import { Home } from '@/pages/Home';
import { History } from '@/pages/History';
import { Settings } from '@/pages/Settings';
import type { PageRoute } from '@/types';

function StatusBar() {
  return (
    <div className="status-bar">
      <span>9:41</span>
      <span className="icons">📶 🔋</span>
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
