import { Trade, PortfolioStats } from '../types';

export const calculatePnl = (entryPrice: number, exitPrice: number, direction: 'long' | 'short'): number => {
  if (direction === 'long') {
    return exitPrice - entryPrice;
  } else {
    return entryPrice - exitPrice;
  }
};

export const calculatePnlPercentage = (entryPrice: number, exitPrice: number, direction: 'long' | 'short'): number => {
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
    if (trade.exitPrice) {
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
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

export const formatNumber = (value: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}; 