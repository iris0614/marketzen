import React, { useState } from 'react';
import { Trade, PortfolioStats, AppSettings } from '../types';
import { formatCurrency, formatPercentage, formatNumber } from '../utils/calculations';
import { t } from '../i18n';
import StatsCard from '../components/StatsCard';
import TradeCard from '../components/TradeCard';
import { TrendingUp, TrendingDown, Target, Activity } from 'lucide-react';

interface DashboardProps {
  trades: Trade[];
  stats: PortfolioStats;
  settings: AppSettings;
  onUpdateTrade: (id: string, updates: Partial<Trade>) => void;
  onDeleteTrade: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  trades,
  stats,
  settings,
  onUpdateTrade,
  onDeleteTrade,
}) => {
  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open');
  const { language } = settings;

  const openTrades = trades.filter(trade => trade.status === 'open');
  const closedTrades = trades.filter(trade => trade.status === 'closed');

  const statsCards = [
    {
      title: t('totalPnl', language),
      value: formatCurrency(stats.totalPnl, settings.currency),
      change: formatPercentage(stats.totalPnlPercentage),
      isPositive: stats.totalPnl >= 0,
      icon: stats.totalPnl >= 0 ? TrendingUp : TrendingDown,
    },
    {
      title: t('winRate', language),
      value: `${formatNumber(stats.winRate)}%`,
      change: `${stats.totalTrades} ${t('totalTrades', language)}`,
      isPositive: stats.winRate >= 50,
      icon: Target,
    },
    {
      title: t('openPositions', language),
      value: stats.openPositions.toString(),
      change: `${formatNumber(stats.averageReturn)}% avg`,
      isPositive: true,
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statsCards.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('open')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'open'
              ? 'bg-white text-gray-900 shadow-soft'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {t('open', language)} ({openTrades.length})
        </button>
        <button
          onClick={() => setActiveTab('closed')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'closed'
              ? 'bg-white text-gray-900 shadow-soft'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {t('closed', language)} ({closedTrades.length})
        </button>
      </div>

      {/* Trades List */}
      <div className="space-y-4">
        {activeTab === 'open' && (
          <>
            {openTrades.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">
                  {t('noTrades', language)}
                </div>
                <p className="text-gray-500 text-sm">
                  {language === 'zh' ? '开始记录你的第一笔交易' : 'Start recording your first trade'}
                </p>
              </div>
            ) : (
              openTrades.map(trade => (
                <TradeCard
                  key={trade.id}
                  trade={trade}
                  settings={settings}
                  onUpdate={onUpdateTrade}
                  onDelete={onDeleteTrade}
                />
              ))
            )}
          </>
        )}

        {activeTab === 'closed' && (
          <>
            {closedTrades.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">
                  {language === 'zh' ? '暂无已平仓交易' : 'No closed trades yet'}
                </div>
                <p className="text-gray-500 text-sm">
                  {language === 'zh' ? '平仓交易后会显示在这里' : 'Closed trades will appear here'}
                </p>
              </div>
            ) : (
              closedTrades.map(trade => (
                <TradeCard
                  key={trade.id}
                  trade={trade}
                  settings={settings}
                  onUpdate={onUpdateTrade}
                  onDelete={onDeleteTrade}
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 