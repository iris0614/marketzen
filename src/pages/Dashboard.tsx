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
      isPositive: stats.totalTrades === 0 ? true : stats.winRate >= 50,
      icon: Target,
    },
    {
      title: t('openPositions', language),
      value: stats.openPositions.toString(),
      change: `${formatNumber(stats.averageReturn)} ${t('averageReturn', language)}`,
      isPositive: true,
      icon: Activity,
    },
  ];

  const list = activeTab === 'open' ? openTrades : closedTrades;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statsCards.map((card) => (
          <StatsCard key={card.title} {...card} />
        ))}
      </div>

      <div className="flex space-x-1 bg-paper-200 p-1 rounded-[12px] border border-paper-400">
        <button
          type="button"
          onClick={() => setActiveTab('open')}
          className={`flex-1 py-2 px-4 rounded-[10px] text-sm font-medium transition-colors ${
            activeTab === 'open'
              ? 'bg-paper-50 text-ink shadow-soft'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          {t('open', language)} ({openTrades.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('closed')}
          className={`flex-1 py-2 px-4 rounded-[10px] text-sm font-medium transition-colors ${
            activeTab === 'closed'
              ? 'bg-paper-50 text-ink shadow-soft'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          {t('closed', language)} ({closedTrades.length})
        </button>
      </div>

      <div className="space-y-4">
        {list.length === 0 ? (
          <div className="text-center py-14 card">
            <div className="font-serif text-xl text-ink-muted mb-2">
              {activeTab === 'open' ? t('noTrades', language) : t('noClosedTrades', language)}
            </div>
            <p className="text-ink-faint text-sm">
              {activeTab === 'open' ? t('startFirstTrade', language) : t('closedTradesHint', language)}
            </p>
          </div>
        ) : (
          list.map(trade => (
            <TradeCard
              key={trade.id}
              trade={trade}
              settings={settings}
              onUpdate={onUpdateTrade}
              onDelete={onDeleteTrade}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
