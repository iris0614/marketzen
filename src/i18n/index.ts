import { Language } from '../types';

export const translations = {
  zh: {
    // Navigation
    dashboard: '仪表盘',
    journal: '投资手帐',
    newTrade: '新建交易',
    review: '复盘分析',
    settings: '设置',
    
    // Dashboard
    totalPnl: '总盈亏',
    winRate: '胜率',
    openPositions: '持仓中',
    totalTrades: '总交易',
    averageReturn: '平均收益',
    
    // Trade Form
    tradeBackground: '交易背景',
    macroContext: '宏观背景',
    keywords: '关键词',
    addKeyword: '添加关键词',
    thesis: '交易笔记',
    thesisPlaceholder: '记录你的交易逻辑和思考...',
    
    tradeDetails: '交易详情',
    asset: '标的',
    assetPlaceholder: '输入股票代码或加密货币对',
    direction: '方向',
    long: '做多',
    short: '做空',
    entryPrice: '买入价格',
    amount: '投入金额',
    portfolioPercentage: '仓位比例',
    
    tradePlan: '交易计划',
    takeProfit: '止盈位',
    stopLoss: '止损位',
    
    tradeResult: '交易结果',
    exitPrice: '平仓价格',
    finalPnl: '最终盈亏',
    postMortemNotes: '复盘总结',
    postMortemPlaceholder: '记录这次交易的经验教训...',
    extractAsPrinciple: '提炼为原则',
    
    // Actions
    save: '保存',
    cancel: '取消',
    edit: '编辑',
    delete: '删除',
    close: '平仓',
    open: '持仓中',
    closed: '已平仓',
    
    // Status
    status: '状态',
    profit: '盈利',
    loss: '亏损',
    
    // Analysis
    filterByKeywords: '按关键词筛选',
    searchTrades: '搜索交易',
    dateRange: '日期范围',
    allTrades: '所有交易',
    profitTrades: '盈利交易',
    lossTrades: '亏损交易',
    
    // Settings
    language: '语言',
    totalPortfolio: '总资金',
    currency: '货币',
    chinese: '中文',
    english: 'English',
    
    // Messages
    tradeSaved: '交易已保存',
    tradeDeleted: '交易已删除',
    tradeClosed: '交易已平仓',
    confirmDelete: '确定要删除这笔交易吗？',
    confirmClose: '确定要平仓这笔交易吗？',
    
    // Placeholders
    noTrades: '暂无交易记录',
    noResults: '没有找到符合条件的交易',
    loading: '加载中...',
    
    // Errors
    required: '此字段为必填项',
    invalidPrice: '请输入有效的价格',
    invalidAmount: '请输入有效的金额',
    invalidPercentage: '请输入有效的百分比',
    
    // Investment Journal
    myInvestmentJournal: '我的投资手帐',
    myPlaybook: '我的交易法则',
    addPrinciple: '添加原则',
    principle: '原则',
    principlePlaceholder: '写下你的投资原则...',
    category: '分类',
    selectCategory: '选择分类',
    generalPrinciple: '通用原则',
    learnedPrinciple: '复盘提炼',
    sourceTrade: '源自交易',
    principleSaved: '原则已保存',
    principleDeleted: '原则已删除',
    confirmDeletePrinciple: '确定要删除这条原则吗？',
    noPrinciples: '暂无投资原则',
    extractPrinciple: '提炼为原则',
    extractPrincipleTitle: '提炼投资原则',
    extractPrincipleDesc: '将这次交易的教训提炼为可复用的投资原则',
    principleContent: '原则内容',
    principleContentPlaceholder: '将复盘总结提炼为通用的投资原则...',
    allCategories: '所有分类',
    riskManagement: '风险管理',
    mindset: '心态纪律',
    entryStrategy: '入场策略',
    exitStrategy: '出场策略',
    positionSizing: '仓位管理',
  },
  
  en: {
    // Navigation
    dashboard: 'Dashboard',
    journal: 'Journal',
    newTrade: 'New Trade',
    review: 'Review',
    settings: 'Settings',
    
    // Dashboard
    totalPnl: 'Total P&L',
    winRate: 'Win Rate',
    openPositions: 'Open Positions',
    totalTrades: 'Total Trades',
    averageReturn: 'Avg Return',
    
    // Trade Form
    tradeBackground: 'Trade Background',
    macroContext: 'Macro Context',
    keywords: 'Keywords',
    addKeyword: 'Add Keyword',
    thesis: 'My Thesis',
    thesisPlaceholder: 'Record your trading logic and thoughts...',
    
    tradeDetails: 'Trade Details',
    asset: 'Asset',
    assetPlaceholder: 'Enter stock symbol or crypto pair',
    direction: 'Direction',
    long: 'Long',
    short: 'Short',
    entryPrice: 'Entry Price',
    amount: 'Amount',
    portfolioPercentage: 'Portfolio %',
    
    tradePlan: 'Trade Plan',
    takeProfit: 'Take Profit',
    stopLoss: 'Stop Loss',
    
    tradeResult: 'Trade Result',
    exitPrice: 'Exit Price',
    finalPnl: 'Final P&L',
    postMortemNotes: 'Post-Mortem Notes',
    postMortemPlaceholder: 'Record lessons learned from this trade...',
    extractAsPrinciple: 'Extract as Principle',
    
    // Actions
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    close: 'Close',
    open: 'Open',
    closed: 'Closed',
    
    // Status
    status: 'Status',
    profit: 'Profit',
    loss: 'Loss',
    
    // Analysis
    filterByKeywords: 'Filter by Keywords',
    searchTrades: 'Search Trades',
    dateRange: 'Date Range',
    allTrades: 'All Trades',
    profitTrades: 'Profit Trades',
    lossTrades: 'Loss Trades',
    
    // Settings
    language: 'Language',
    totalPortfolio: 'Total Portfolio',
    currency: 'Currency',
    chinese: '中文',
    english: 'English',
    
    // Messages
    tradeSaved: 'Trade saved successfully',
    tradeDeleted: 'Trade deleted successfully',
    tradeClosed: 'Trade closed successfully',
    confirmDelete: 'Are you sure you want to delete this trade?',
    confirmClose: 'Are you sure you want to close this trade?',
    
    // Placeholders
    noTrades: 'No trades yet',
    noResults: 'No trades found',
    loading: 'Loading...',
    
    // Errors
    required: 'This field is required',
    invalidPrice: 'Please enter a valid price',
    invalidAmount: 'Please enter a valid amount',
    invalidPercentage: 'Please enter a valid percentage',
    
    // Investment Journal
    myInvestmentJournal: 'My Investment Journal',
    myPlaybook: 'My Trading Playbook',
    addPrinciple: 'Add Principle',
    principle: 'Principle',
    principlePlaceholder: 'Write your investment principle...',
    category: 'Category',
    selectCategory: 'Select Category',
    generalPrinciple: 'General Principle',
    learnedPrinciple: 'Learned from Trade',
    sourceTrade: 'Source Trade',
    principleSaved: 'Principle saved successfully',
    principleDeleted: 'Principle deleted successfully',
    confirmDeletePrinciple: 'Are you sure you want to delete this principle?',
    noPrinciples: 'No investment principles yet',
    extractPrinciple: 'Extract as Principle',
    extractPrincipleTitle: 'Extract Investment Principle',
    extractPrincipleDesc: 'Extract lessons from this trade into a reusable investment principle',
    principleContent: 'Principle Content',
    principleContentPlaceholder: 'Extract post-mortem notes into a general investment principle...',
    allCategories: 'All Categories',
    riskManagement: 'Risk Management',
    mindset: 'Mindset & Discipline',
    entryStrategy: 'Entry Strategy',
    exitStrategy: 'Exit Strategy',
    positionSizing: 'Position Sizing',
  },
};

export const t = (key: string, language: Language): string => {
  return translations[language][key as keyof typeof translations[typeof language]] || key;
}; 