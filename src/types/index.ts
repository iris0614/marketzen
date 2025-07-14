export interface Trade {
  id: string;
  asset: string;
  direction: 'long' | 'short';
  entryPrice: number;
  amount: number;
  portfolioPercentage?: number;
  takeProfit?: number;
  stopLoss?: number;
  exitPrice?: number;
  status: 'open' | 'closed';
  macroContext: string[];
  thesis: string;
  postMortemNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TradeFormData {
  asset: string;
  direction: 'long' | 'short';
  entryPrice: number;
  amount: number;
  portfolioPercentage?: number;
  takeProfit?: number;
  stopLoss?: number;
  macroContext: string[];
  thesis: string;
}

export interface TradeResult {
  exitPrice: number;
  postMortemNotes: string;
}

export interface PortfolioStats {
  totalPnl: number;
  totalPnlPercentage: number;
  winRate: number;
  openPositions: number;
  totalTrades: number;
  averageReturn: number;
}

export interface FilterOptions {
  keywords: string[];
  asset?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: 'open' | 'closed' | 'all';
  pnlFilter?: 'profit' | 'loss' | 'all';
}

export type Language = 'zh' | 'en';

export interface AppSettings {
  language: Language;
  totalPortfolio: number;
  currency: string;
}

// 新增：投资手帐相关类型
export interface InvestmentPrinciple {
  id: string;
  content: string;
  category: string;
  type: 'general' | 'learned';
  sourceTradeId?: string; // 如果是复盘提炼的原则，关联的交易ID
  createdAt: string;
  updatedAt: string;
}

export interface PrincipleFormData {
  content: string;
  category: string;
  type: 'general' | 'learned';
  sourceTradeId?: string;
}

export interface PrincipleCategory {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
} 