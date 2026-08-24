import React, { useState, useMemo } from 'react';
import { Trade, PortfolioStats, AppSettings } from '../types';
import { formatCurrency, calculatePnl } from '../utils/calculations';
import { storage } from '../utils/storage';
import { t } from '../i18n';
import TradeCard from '../components/TradeCard';
import { Search, Filter, BarChart3 } from 'lucide-react';

interface ReviewProps {
  trades: Trade[];
  stats: PortfolioStats;
  settings: AppSettings;
  onUpdateTrade: (id: string, updates: Partial<Trade>) => void;
  onDeleteTrade: (id: string) => void;
}

const Review: React.FC<ReviewProps> = ({ trades, settings, onUpdateTrade, onDeleteTrade }) => {
  const { language } = settings;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [pnlFilter, setPnlFilter] = useState<'all' | 'profit' | 'loss'>('all');

  const availableKeywords = useMemo(() => storage.getKeywords(), []);

  const filteredTrades = useMemo(() => {
    return trades.filter(trade => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        if (!trade.asset.toLowerCase().includes(q) &&
            !trade.thesis.toLowerCase().includes(q)) {
          return false;
        }
      }

      if (selectedKeywords.length > 0 &&
          !selectedKeywords.some(keyword => trade.macroContext.includes(keyword))) {
        return false;
      }

      if (statusFilter !== 'all' && trade.status !== statusFilter) {
        return false;
      }

      if (pnlFilter !== 'all' && trade.exitPrice) {
        const pnl = calculatePnl(trade.entryPrice, trade.exitPrice, trade.direction);
        if (pnlFilter === 'profit' && pnl <= 0) return false;
        if (pnlFilter === 'loss' && pnl >= 0) return false;
      }

      return true;
    });
  }, [trades, searchTerm, selectedKeywords, statusFilter, pnlFilter]);

  const filteredStats = useMemo(() => {
    const closedTrades = filteredTrades.filter(trade => trade.status === 'closed' && trade.exitPrice);
    let totalPnl = 0;
    let winningTrades = 0;

    closedTrades.forEach(trade => {
      if (trade.exitPrice && trade.entryPrice) {
        const pnl = calculatePnl(trade.entryPrice, trade.exitPrice, trade.direction);
        const tradePnl = pnl * (trade.amount / trade.entryPrice);
        totalPnl += tradePnl;
        if (tradePnl > 0) winningTrades++;
      }
    });

    return {
      totalTrades: filteredTrades.length,
      closedTrades: closedTrades.length,
      totalPnl,
      winRate: closedTrades.length > 0 ? (winningTrades / closedTrades.length) * 100 : 0,
    };
  }, [filteredTrades]);

  const handleKeywordToggle = (keyword: string) => {
    setSelectedKeywords(prev =>
      prev.includes(keyword)
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="page-title">
        {t('review', language)}
      </h1>

      <div className="card p-5 sm:p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter size={18} className="text-ink-faint" />
          <h2 className="section-title mb-0">
            {t('filterByKeywords', language)}
          </h2>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchTrades', language)}
              className="input pl-10"
            />
          </div>
        </div>

        {availableKeywords.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-ink-muted mb-2">
              {t('keywords', language)}
            </p>
            <div className="flex flex-wrap gap-2">
              {availableKeywords.map((keyword) => (
                <button
                  type="button"
                  key={keyword}
                  onClick={() => handleKeywordToggle(keyword)}
                  className={`tag ${
                    selectedKeywords.includes(keyword)
                      ? 'tag-primary'
                      : 'tag-gray'
                  }`}
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-2">
              {t('status', language)}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'open' | 'closed')}
              className="input"
            >
              <option value="all">{t('allTrades', language)}</option>
              <option value="open">{t('open', language)}</option>
              <option value="closed">{t('closed', language)}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-muted mb-2">
              {t('pnlFilter', language)}
            </label>
            <select
              value={pnlFilter}
              onChange={(e) => setPnlFilter(e.target.value as 'all' | 'profit' | 'loss')}
              className="input"
            >
              <option value="all">{t('allTrades', language)}</option>
              <option value="profit">{t('profitTrades', language)}</option>
              <option value="loss">{t('lossTrades', language)}</option>
            </select>
          </div>
        </div>
      </div>

      {filteredTrades.length > 0 && (
        <div className="card p-5 sm:p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 size={18} className="text-ink-faint" />
            <h2 className="section-title mb-0">
              {t('filterResults', language)}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-ink-muted">{t('totalTrades', language)}</p>
              <p className="text-xl font-serif text-ink">{filteredStats.totalTrades}</p>
            </div>
            <div>
              <p className="text-sm text-ink-muted">{t('closed', language)}</p>
              <p className="text-xl font-serif text-ink">{filteredStats.closedTrades}</p>
            </div>
            <div>
              <p className="text-sm text-ink-muted">{t('totalPnl', language)}</p>
              <p className={`text-xl font-serif ${
                filteredStats.totalPnl >= 0 ? 'text-sage-600' : 'text-rose-600'
              }`}>
                {formatCurrency(filteredStats.totalPnl, settings.currency)}
              </p>
            </div>
            <div>
              <p className="text-sm text-ink-muted">{t('winRate', language)}</p>
              <p className="text-xl font-serif text-ink">
                {filteredStats.winRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredTrades.length === 0 ? (
          <div className="text-center py-14 card">
            <div className="font-serif text-xl text-ink-muted mb-2">
              {t('noResults', language)}
            </div>
            <p className="text-ink-faint text-sm">
              {t('tryAdjustFilters', language)}
            </p>
          </div>
        ) : (
          filteredTrades.map(trade => (
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

export default Review;
