import { Trade, AppSettings, InvestmentPrinciple, PrincipleCategory } from '../types';

const STORAGE_KEYS = {
  TRADES: 'investment_tracker_trades',
  SETTINGS: 'investment_tracker_settings',
  KEYWORDS: 'investment_tracker_keywords',
  PRINCIPLES_ZH: 'investment_tracker_principles_zh',
  PRINCIPLES_EN: 'investment_tracker_principles_en',
  CATEGORIES_ZH: 'investment_tracker_categories_zh',
  CATEGORIES_EN: 'investment_tracker_categories_en',
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
  getPrinciples: (language: 'zh' | 'en' = 'zh'): InvestmentPrinciple[] => {
    try {
      const data = localStorage.getItem(language === 'zh' ? STORAGE_KEYS.PRINCIPLES_ZH : STORAGE_KEYS.PRINCIPLES_EN);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading principles:', error);
      return [];
    }
  },

  savePrinciples: (principles: InvestmentPrinciple[], language: 'zh' | 'en' = 'zh'): void => {
    try {
      localStorage.setItem(language === 'zh' ? STORAGE_KEYS.PRINCIPLES_ZH : STORAGE_KEYS.PRINCIPLES_EN, JSON.stringify(principles));
    } catch (error) {
      console.error('Error saving principles:', error);
    }
  },

  addPrinciple: (principle: InvestmentPrinciple, language: 'zh' | 'en' = 'zh'): void => {
    const principles = storage.getPrinciples(language);
    principles.push(principle);
    storage.savePrinciples(principles, language);
  },

  updatePrinciple: (id: string, updates: Partial<InvestmentPrinciple>, language: 'zh' | 'en' = 'zh'): void => {
    const principles = storage.getPrinciples(language);
    const index = principles.findIndex(principle => principle.id === id);
    if (index !== -1) {
      principles[index] = { ...principles[index], ...updates, updatedAt: new Date().toISOString() };
      storage.savePrinciples(principles, language);
    }
  },

  deletePrinciple: (id: string, language: 'zh' | 'en' = 'zh'): void => {
    const principles = storage.getPrinciples(language);
    const filteredPrinciples = principles.filter(principle => principle.id !== id);
    storage.savePrinciples(filteredPrinciples, language);
  },

  // Categories
  getCategories: (language: 'zh' | 'en' = 'zh'): PrincipleCategory[] => {
    try {
      const data = localStorage.getItem(language === 'zh' ? STORAGE_KEYS.CATEGORIES_ZH : STORAGE_KEYS.CATEGORIES_EN);
      if (data) {
        return JSON.parse(data);
      }
      
      // Default categories based on language
      const defaultCategories = {
        zh: [
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
        ],
        en: [
          {
            id: 'risk-management',
            name: 'Risk Management',
            color: '#ef4444',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'mindset',
            name: 'Mindset & Discipline',
            color: '#3b82f6',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'entry-strategy',
            name: 'Entry Strategy',
            color: '#10b981',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'exit-strategy',
            name: 'Exit Strategy',
            color: '#f59e0b',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'position-sizing',
            name: 'Position Sizing',
            color: '#8b5cf6',
            createdAt: new Date().toISOString(),
          },
        ]
      };
      
      return defaultCategories[language];
    } catch (error) {
      console.error('Error loading categories:', error);
      return [];
    }
  },

  saveCategories: (categories: PrincipleCategory[], language: 'zh' | 'en' = 'zh'): void => {
    try {
      localStorage.setItem(language === 'zh' ? STORAGE_KEYS.CATEGORIES_ZH : STORAGE_KEYS.CATEGORIES_EN, JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  },

  addCategory: (category: PrincipleCategory, language: 'zh' | 'en' = 'zh'): void => {
    const categories = storage.getCategories(language);
    categories.push(category);
    storage.saveCategories(categories, language);
  },
}; 