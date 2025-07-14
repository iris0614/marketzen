import { InvestmentPrinciple, PrincipleCategory } from '../types';
import { generateId } from './calculations';

export const getDemoPrinciples = (language: 'zh' | 'en' = 'zh'): InvestmentPrinciple[] => {
  const demoData = {
    zh: [
      {
        id: generateId(),
        content: "永远不要在亏损的头寸上加仓。亏损说明判断有误，加仓只会放大错误。",
        category: "risk-management",
        type: "general" as const,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        content: "只在上升趋势中买入。即使宏观背景有利，也绝不买入处于下降趋势的标的。",
        category: "entry-strategy",
        type: "learned" as const,
        sourceTradeId: "demo-trade-1",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        content: "单笔交易风险不超过总资金的2%。保护本金永远是第一位的。",
        category: "position-sizing",
        type: "general" as const,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        content: "避免在重大不确定性事件（如财报）前建立大的头寸。",
        category: "risk-management",
        type: "learned" as const,
        sourceTradeId: "demo-trade-2",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        content: "市场永远是对的。当市场证明你的判断错误时，立即止损，不要固执己见。",
        category: "mindset",
        type: "general" as const,
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    en: [
      {
        id: generateId(),
        content: "Never add to a losing position. A loss means your judgment was wrong, and adding will only amplify the mistake.",
        category: "risk-management",
        type: "general" as const,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        content: "Only buy in an uptrend. Even if the macro background is favorable, never buy an asset in a downtrend.",
        category: "entry-strategy",
        type: "learned" as const,
        sourceTradeId: "demo-trade-1",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        content: "Risk per trade should not exceed 2% of total capital. Protecting principal is always the top priority.",
        category: "position-sizing",
        type: "general" as const,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        content: "Avoid taking large positions before major uncertainty events (e.g., earnings reports).",
        category: "risk-management",
        type: "learned" as const,
        sourceTradeId: "demo-trade-2",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        content: "The market is always right. When the market proves you wrong, cut your losses immediately and don't be stubborn.",
        category: "mindset",
        type: "general" as const,
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]
  };
  
  return demoData[language];
};

export const getDemoCategories = (language: 'zh' | 'en' = 'zh'): PrincipleCategory[] => {
  const demoData = {
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
  
  return demoData[language];
};

// Legacy exports for backward compatibility
export const demoPrinciples = getDemoPrinciples('zh');
export const demoCategories = getDemoCategories('zh'); 