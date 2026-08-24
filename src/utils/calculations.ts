import { Trade, PortfolioStats } from '../types';

export const calculatePnl = (entryPrice: number, exitPrice: number, direction: 'long' | 'short'): number => {
  if (!entryPrice || exitPrice == null || Number.isNaN(entryPrice) || Number.isNaN(exitPrice)) {
    return 0;
  }
  if (direction === 'long') {
    return exitPrice - entryPrice;
  }
  return entryPrice - exitPrice;
};

export const calculatePnlPercentage = (entryPrice: number, exitPrice: number, direction: 'long' | 'short'): number => {
  if (!entryPrice) return 0;
  const pnl = calculatePnl(entryPrice, exitPrice, direction);
  return (pnl / entryPrice) * 100;
};

export const calculatePortfolioStats = (trades: Trade[]): PortfolioStats => {
  const closedTrades = trades.filter(trade => trade.status === 'closed' && trade.exitPrice);
  const openTrades = trades.filter(trade => trade.status === 'open');

  let totalPnl = 0;
  let totalInvested = 0;
  let winningTrades = 0;

  closedTrades.forEach(trade => {
    if (trade.exitPrice && trade.entryPrice) {
      const pnl = calculatePnl(trade.entryPrice, trade.exitPrice, trade.direction);
      const tradePnl = pnl * (trade.amount / trade.entryPrice);
      totalPnl += tradePnl;
      totalInvested += trade.amount;

      if (tradePnl > 0) {
        winningTrades++;
      }
    }
  });

  const totalPnlPercentage = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;
  const winRate = closedTrades.length > 0 ? (winningTrades / closedTrades.length) * 100 : 0;
  const averageReturn = closedTrades.length > 0 ? totalPnl / closedTrades.length : 0;

  return {
    totalPnl,
    totalPnlPercentage,
    winRate,
    openPositions: openTrades.length,
    totalTrades: trades.length,
    averageReturn,
  };
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  const value = Number(amount);
  const safe = Number.isFinite(value) ? value : 0;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(safe);
  } catch {
    return `${currency || 'USD'} ${safe.toFixed(2)}`;
  }
};

export const formatPercentage = (value: number): string => {
  const safe = Number.isFinite(value) ? value : 0;
  return `${safe >= 0 ? '+' : ''}${safe.toFixed(2)}%`;
};

export const formatNumber = (value: number, decimals: number = 2): string => {
  const safe = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(safe);
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
};

export const toLocalDateString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const parseLocalDate = (value: string): Date | null => {
  if (!value) return null;
  const parts = value.split('-').map(Number);
  if (parts.length !== 3 || parts.some(n => Number.isNaN(n))) return null;
  const [y, m, d] = parts;
  return new Date(y, m - 1, d);
};

export const toNumber = (value: number | string | undefined, fallback = 0): number => {
  if (value === '' || value == null) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};
