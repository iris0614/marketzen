import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Trade, AppSettings } from './types';
import { storage } from './utils/storage';
import { calculatePortfolioStats } from './utils/calculations';
import { t } from './i18n';
import Header from './components/Header';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TradeForm from './pages/TradeForm';
import Review from './pages/Review';
import Journal from './pages/Journal';
import Settings from './pages/Settings';

const queryClient = new QueryClient();

// 受保护的路由组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function AppContent() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [settings, setSettings] = useState<AppSettings>(storage.getSettings());
  const [stats, setStats] = useState(calculatePortfolioStats([]));
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const savedTrades = storage.getTrades();
    setTrades(savedTrades);
    setStats(calculatePortfolioStats(savedTrades));
  }, []);

  const handleAddTrade = (trade: Trade) => {
    const newTrades = [...trades, trade];
    setTrades(newTrades);
    setStats(calculatePortfolioStats(newTrades));
    storage.addTrade(trade);
    
    // Add keywords to storage
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

  const handlePrincipleChange = () => {
    // This function is called when principles are added/updated/deleted
    // We can add any additional logic here if needed
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* 欢迎页面 - 不需要Header */}
          <Route path="/" element={<Welcome />} />
          
          {/* 认证页面 */}
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
          } />
          
          {/* 受保护的页面 - 需要Header */}
          <Route path="/*" element={
            <ProtectedRoute>
              <>
                <Header 
                  language={settings.language}
                  onLanguageChange={(language) => handleUpdateSettings({ ...settings, language })}
                />
                
                <main className="container mx-auto px-4 py-6 max-w-6xl">
                  <Routes>
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
                          onPrincipleChange={handlePrincipleChange}
                        />
                      } 
                    />
                    <Route 
                      path="/review" 
                      element={
                        <Review 
                          trades={trades}
                          stats={stats}
                          settings={settings}
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
                  </Routes>
                </main>
              </>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App; 