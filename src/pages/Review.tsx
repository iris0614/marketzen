import React, { useState, useMemo } from 'react';
import { Trade, PortfolioStats, AppSettings, FilterOptions } from '../types';
import { formatCurrency, formatPercentage, calculatePnl, calculatePnlPercentage } from '../utils/calculations';
import { storage } from '../utils/storage';
import { t } from '../i18n';
import TradeCard from '../components/TradeCard';
import { Search, Filter, BarChart3 } from 'lucide-react';

interface ReviewProps {
  trades: Trade[];
  stats: PortfolioStats;
  settings: AppSettings;
}

const Review: React.FC<ReviewProps> = ({ trades, stats, settings }) => {
  const { language } = settings;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [pnlFilter, setPnlFilter] = useState<'all' | 'profit' | 'loss'>('all');
  
  const availableKeywords = useMemo(() => storage.getKeywords(), []);

  const filteredTrades = useMemo(() => {
    return trades.filter(trade => {
      // Search term filter
      if (searchTerm && !trade.asset.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !trade.thesis.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Keywords filter
      if (selectedKeywords.length > 0 && 
          !selectedKeywords.some(keyword => trade.macroContext.includes(keyword))) {
        return false;
      }
      
      // Status filter
      if (statusFilter !== 'all' && trade.status !== statusFilter) {
        return false;
      }
      
      // PnL filter
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
      if (trade.exitPrice) {
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('review', language)}
        </h1>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter size={20} className="text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">
            {t('filterByKeywords', language)}
          </h2>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchTrades', language)}
              className="input pl-10"
            />
          </div>
        </div>

        {/* Keywords */}
        {availableKeywords.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              {t('keywords', language)}
            </p>
            <div className="flex flex-wrap gap-2">
              {availableKeywords.map((keyword) => (
                <button
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

        {/* Status and PnL Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('status', language)}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="input"
            >
              <option value="all">{t('allTrades', language)}</option>
              <option value="open">{t('open', language)}</option>
              <option value="closed">{t('closed', language)}</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('pnlFilter', language)}
            </label>
            <select
              value={pnlFilter}
              onChange={(e) => setPnlFilter(e.target.value as any)}
              className="input"
            >
              <option value="all">{t('allTrades', language)}</option>
              <option value="profit">{t('profitTrades', language)}</option>
              <option value="loss">{t('lossTrades', language)}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {filteredTrades.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 size={20} className="text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              {language === 'zh' ? '筛选结果' : 'Filter Results'}
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">{t('totalTrades', language)}</p>
              <p className="text-xl font-bold text-gray-900">{filteredStats.totalTrades}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('closed', language)}</p>
              <p className="text-xl font-bold text-gray-900">{filteredStats.closedTrades}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('totalPnl', language)}</p>
              <p className={`text-xl font-bold ${
                filteredStats.totalPnl >= 0 ? 'text-success-600' : 'text-danger-600'
              }`}>
                {formatCurrency(filteredStats.totalPnl, settings.currency)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('winRate', language)}</p>
              <p className="text-xl font-bold text-gray-900">
                {filteredStats.winRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Trades List */}
      <div className="space-y-4">
        {filteredTrades.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">
              {t('noResults', language)}
            </div>
            <p className="text-gray-500 text-sm">
              {language === 'zh' ? '尝试调整筛选条件' : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          filteredTrades.map(trade => (
            <TradeCard
              key={trade.id}
              trade={trade}
              settings={settings}
              onUpdate={() => {}} // Read-only in review mode
              onDelete={() => {}} // Read-only in review mode
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Review; 