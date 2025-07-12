import { Trade, AppSettings, InvestmentPrinciple, PrincipleCategory } from '../types';

const STORAGE_KEYS = {
  TRADES: 'investment_tracker_trades',
  SETTINGS: 'investment_tracker_settings',
  KEYWORDS: 'investment_tracker_keywords',
  PRINCIPLES: 'investment_tracker_principles',
  CATEGORIES: 'investment_tracker_categories',
} as const;

export const storage = {
  // Trades
  getTrades: (): Trade[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRADES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading trades:', error);
      return [];
    }
  },

  saveTrades: (trades: Trade[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(trades));
    } catch (error) {
      console.error('Error saving trades:', error);
    }
  },

  addTrade: (trade: Trade): void => {
    const trades = storage.getTrades();
    trades.push(trade);
    storage.saveTrades(trades);
  },

  updateTrade: (id: string, updates: Partial<Trade>): void => {
    const trades = storage.getTrades();
    const index = trades.findIndex(trade => trade.id === id);
    if (index !== -1) {
      trades[index] = { ...trades[index], ...updates, updatedAt: new Date().toISOString() };
      storage.saveTrades(trades);
    }
  },

  deleteTrade: (id: string): void => {
    const trades = storage.getTrades();
    const filteredTrades = trades.filter(trade => trade.id !== id);
    storage.saveTrades(filteredTrades);
  },

  // Settings
  getSettings: (): AppSettings => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : {
        language: 'zh' as const,
        totalPortfolio: 100000,
        currency: 'USD'
      };
    } catch (error) {
      console.error('Error loading settings:', error);
      return {
        language: 'zh' as const,
        totalPortfolio: 100000,
        currency: 'USD'
      };
    }
  },

  saveSettings: (settings: AppSettings): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  // Keywords
  getKeywords: (): string[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.KEYWORDS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading keywords:', error);
      return [];
    }
  },

  saveKeywords: (keywords: string[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.KEYWORDS, JSON.stringify(keywords));
    } catch (error) {
      console.error('Error saving keywords:', error);
    }
  },

  addKeyword: (keyword: string): void => {
    const keywords = storage.getKeywords();
    if (!keywords.includes(keyword)) {
      keywords.push(keyword);
      storage.saveKeywords(keywords);
    }
  },

  // Investment Principles
  getPrinciples: (): InvestmentPrinciple[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRINCIPLES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading principles:', error);
      return [];
    }
  },

  savePrinciples: (principles: InvestmentPrinciple[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRINCIPLES, JSON.stringify(principles));
    } catch (error) {
      console.error('Error saving principles:', error);
    }
  },

  addPrinciple: (principle: InvestmentPrinciple): void => {
    const principles = storage.getPrinciples();
    principles.push(principle);
    storage.savePrinciples(principles);
  },

  updatePrinciple: (id: string, updates: Partial<InvestmentPrinciple>): void => {
    const principles = storage.getPrinciples();
    const index = principles.findIndex(principle => principle.id === id);
    if (index !== -1) {
      principles[index] = { ...principles[index], ...updates, updatedAt: new Date().toISOString() };
      storage.savePrinciples(principles);
    }
  },

  deletePrinciple: (id: string): void => {
    const principles = storage.getPrinciples();
    const filteredPrinciples = principles.filter(principle => principle.id !== id);
    storage.savePrinciples(filteredPrinciples);
  },

  // Categories
  getCategories: (): PrincipleCategory[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return data ? JSON.parse(data) : [
        {
          id: 'risk-management',
          name: '风险管理',
          color: '#ef4444',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'mindset',
          name: '心态纪律',
          color: '#3b82f6',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'entry-strategy',
          name: '入场策略',
          color: '#10b981',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'exit-strategy',
          name: '出场策略',
          color: '#f59e0b',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'position-sizing',
          name: '仓位管理',
          color: '#8b5cf6',
          createdAt: new Date().toISOString(),
        },
      ];
    } catch (error) {
      console.error('Error loading categories:', error);
      return [];
    }
  },

  saveCategories: (categories: PrincipleCategory[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  },

  addCategory: (category: PrincipleCategory): void => {
    const categories = storage.getCategories();
    categories.push(category);
    storage.saveCategories(categories);
  },
}; 