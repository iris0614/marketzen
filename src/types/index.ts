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
  tradeDate: string;
  vixIndex: number;
  instrumentType: '现货' | '合约' | 'spot' | 'futures';
}

export interface TradeFormData {
  asset: string;
  direction: 'long' | 'short';
  entryPrice: number | string;
  amount: number | string;
  portfolioPercentage?: number | string;
  takeProfit?: number | string;
  stopLoss?: number | string;
  macroContext: string[];
  thesis: string;
  tradeDate: string;
  vixIndex: number;
  instrumentType: '现货' | '合约' | 'spot' | 'futures' | '';
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
  totalPortfolio: string | number;
  currency: string;
}

export interface InvestmentPrinciple {
  id: string;
  content: string;
  category: string;
  type: 'general' | 'learned';
  sourceTradeId?: string;
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

export type NoteTag =
  | 'value'
  | 'psychology'
  | 'cycle'
  | 'risk'
  | 'trading'
  | 'philosophy'
  | 'biography'
  | 'china'
  | 'index'
  | 'growth'
  | 'macro'
  | 'behavioral'
  | 'fundamentals'
  | 'business';

export interface LocalizedText {
  zh: string;
  en: string;
}

export interface InvestmentNote {
  id: string;
  year: number;
  title: LocalizedText;
  author: LocalizedText;
  tags: NoteTag[];
  quote: LocalizedText;
  insight: LocalizedText;
  cover: string;
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

export type DiaryBlockType =
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'bullet'
  | 'numbered'
  | 'quote'
  | 'todo'
  | 'divider';

export interface DiaryBlock {
  id: string;
  type: DiaryBlockType;
  text: string;
  checked?: boolean;
}

export interface DiaryEntry {
  id: string;
  title: string;
  date: string;
  blocks: DiaryBlock[];
  createdAt: string;
  updatedAt: string;
}
