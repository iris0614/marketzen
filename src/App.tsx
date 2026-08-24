import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Trade, AppSettings } from './types';
import { storage } from './utils/storage';
import { calculatePortfolioStats } from './utils/calculations';

import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import TradeForm from './pages/TradeForm';
import Journal from './pages/Journal';
import Review from './pages/Review';
import Settings from './pages/Settings';
import Notes from './pages/Notes';
import Diary from './pages/Diary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

function AppLayout({
  language,
  onLanguageChange,
}: {
  language: AppSettings['language'];
  onLanguageChange: (language: 'zh' | 'en') => void;
}) {
  return (
    <>
      <Header language={language} onLanguageChange={onLanguageChange} />
      <main className="relative z-[1] container mx-auto px-4 py-8 max-w-6xl w-full overflow-x-hidden">
        <Outlet />
      </main>
    </>
  );
}

function AppContent() {
  const [settings, setSettings] = useState<AppSettings>(storage.getSettings());
  const [trades, setTrades] = useState<Trade[]>([]);
  const [stats, setStats] = useState(calculatePortfolioStats([]));

  useEffect(() => {
    const savedTrades = storage.getTrades();
    setTrades(savedTrades);
    setStats(calculatePortfolioStats(savedTrades));
  }, []);

  useEffect(() => {
    document.documentElement.lang = settings.language === 'zh' ? 'zh-CN' : 'en';
  }, [settings.language]);

  const handleLanguageChange = (language: 'zh' | 'en') => {
    setSettings((prev) => {
      const newSettings = { ...prev, language };
      storage.saveSettings(newSettings);
      return newSettings;
    });
  };

  const handleAddTrade = (trade: Trade) => {
    const newTrades = [...trades, trade];
    setTrades(newTrades);
    setStats(calculatePortfolioStats(newTrades));
    storage.addTrade(trade);
    trade.macroContext.forEach(keyword => {
      storage.addKeyword(keyword);
    });
  };

  const handleUpdateTrade = (id: string, updates: Partial<Trade>) => {
    const updatedTrades = trades.map(trade =>
      trade.id === id ? { ...trade, ...updates } : trade
    );
    setTrades(updatedTrades);
    setStats(calculatePortfolioStats(updatedTrades));
    storage.updateTrade(id, updates);
  };

  const handleDeleteTrade = (id: string) => {
    const filteredTrades = trades.filter(trade => trade.id !== id);
    setTrades(filteredTrades);
    setStats(calculatePortfolioStats(filteredTrades));
    storage.deleteTrade(id);
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    storage.saveSettings(newSettings);
  };

  return (
    <ErrorBoundary language={settings.language}>
      <div className="min-h-screen bg-paper relative">
        <Routes>
          <Route
            path="/"
            element={
              <Welcome
                language={settings.language}
                onLanguageChange={handleLanguageChange}
              />
            }
          />
          <Route
            element={
              <AppLayout
                language={settings.language}
                onLanguageChange={handleLanguageChange}
              />
            }
          >
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  trades={trades}
                  stats={stats}
                  settings={settings}
                  onUpdateTrade={handleUpdateTrade}
                  onDeleteTrade={handleDeleteTrade}
                />
              }
            />
            <Route
              path="/new"
              element={
                <TradeForm
                  settings={settings}
                  onSave={handleAddTrade}
                />
              }
            />
            <Route
              path="/edit/:id"
              element={
                <TradeForm
                  settings={settings}
                  trades={trades}
                  onSave={(trade: Trade) => handleUpdateTrade(trade.id, trade)}
                />
              }
            />
            <Route
              path="/journal"
              element={
                <Journal
                  settings={settings}
                  onPrincipleChange={() => undefined}
                />
              }
            />
            <Route
              path="/notes"
              element={<Notes settings={settings} />}
            />
            <Route
              path="/diary"
              element={<Diary settings={settings} />}
            />
            <Route
              path="/review"
              element={
                <Review
                  trades={trades}
                  stats={stats}
                  settings={settings}
                  onUpdateTrade={handleUpdateTrade}
                  onDeleteTrade={handleDeleteTrade}
                />
              }
            />
            <Route
              path="/settings"
              element={
                <Settings
                  settings={settings}
                  onUpdate={handleUpdateSettings}
                />
              }
            />
          </Route>
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
