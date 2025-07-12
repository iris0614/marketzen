# 观市 - MarketZen

一个简约、直观、高效的投资交易记录工具，专注于宏观背景分析和交易复盘，具备自我进化的投资决策支持系统。

A minimalist, intuitive, and efficient investment trading record tool, focusing on macro background analysis and trade review, with a self-evolving investment decision support system.

## 核心设计理念 / Core Design Philosophy

### 简约 (Simplicity)
- 大量留白，聚焦内容
- 避免不必要的装饰和边框
- 清晰的信息层次结构

### 直观 (Intuitive)
- 功能和操作符合用户直觉
- 无需学习成本
- 符合苹果设计语言

### 高效 (Efficient)
- 快速记录，快速回顾
- 关键信息一目了然
- 支持移动端操作

## 主要功能 / Key Features

### 1. 欢迎页面 (Welcome Page)
- 优雅的动画效果
- 中英文双语支持
- 禅意设计风格

### 2. 仪表盘 (Dashboard)
- 总体盈亏、胜率、持仓数量等关键指标
- 持仓中和已平仓交易的分类展示
- 每笔交易的核心信息一目了然

### 3. 新建/编辑交易 (New/Edit Trade)
- **交易背景模块**：记录宏观背景关键词和交易逻辑
- **交易详情模块**：标的、方向、价格、资金量
- **交易计划模块**：止盈止损设置
- **交易结果模块**：平仓后填写复盘总结
- **提炼为原则**：将复盘总结提炼为可复用的投资原则

### 4. 投资手帐 (Investment Journal) ⭐ 核心功能
这是工具的核心价值所在，让投资决策系统能够自我进化：

#### 页面特色
- **原则卡片设计**：每条原则都是独立的卡片，简洁且信息丰富
- **分类管理**：支持自定义分类（风险管理、心态纪律、入场策略等）
- **来源区分**：
  - **通用原则**：用户主动添加的核心原则
  - **复盘提炼**：从具体交易中总结的原则，带有彩色竖线标识和交易链接

#### 核心功能
- **沉淀智慧**：记录经过验证或深思熟虑的核心原则
- **分类筛选**：按类别快速找到相关原则
- **编辑管理**：支持编辑和删除原则
- **交易关联**：复盘提炼的原则自动关联到源交易

### 5. 复盘分析 (Review & Analysis)
- 按宏观背景关键词筛选交易
- 搜索和多重筛选功能
- 筛选结果的统计分析
- 交易历史的深度回顾

### 6. 设置 (Settings)
- 中英文双语切换
- 总资金和货币设置

## 优化的用户旅程 / Optimized User Journey

### 思考 (Think)
用户在 **投资手帐** 中写下自己的核心原则：
> "我的原则是：只在上升趋势中买入。"

### 计划 (Plan)
用户看到一个机会，在 **新建交易** 页面记录：
- 宏观背景：美联储暂停加息
- 标的：XYZ，价格：$100
- 计划：止损 $95, 止盈 $120

### 执行 (Execute)
用户在券商处完成交易

### 复盘 (Review)
交易结束后，用户回来填写 **事后复盘**：
- 结果：在 $95 止损离场
- 复盘总结：虽然市场背景很好，但这个标的本身处于下降趋势，我违反了自己的原则

### 成长 (Grow) ⭐ 关键环节
用户点击 **[+ 提炼为原则]**，将教训固化：
- 新原则："即使宏观背景有利，也绝不买入处于下降趋势的标的。"
- 这条原则会自动标记为"复盘提炼"，并链接到这次失败的XYZ交易

## 技术栈 / Tech Stack

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **路由**: React Router DOM
- **数据存储**: Local Storage (纯前端应用)
- **部署**: Vercel (免费托管)

## 快速开始 / Quick Start

### 安装依赖 / Install Dependencies
```bash
npm install
```

### 启动开发服务器 / Start Development Server
```bash
npm run dev
```

### 构建生产版本 / Build for Production
```bash
npm run build
```

### 在线访问 / Online Access
访问 [MarketZen](https://your-vercel-url.vercel.app) 即可使用

## 项目结构 / Project Structure

```
src/
├── components/          # 可复用组件
│   ├── Header.tsx      # 顶部导航栏
│   ├── Logo.tsx        # Logo组件
│   ├── StatsCard.tsx   # 统计卡片
│   └── TradeCard.tsx   # 交易卡片
├── pages/              # 页面组件
│   ├── Welcome.tsx     # 欢迎页面
│   ├── Dashboard.tsx   # 仪表盘
│   ├── TradeForm.tsx   # 交易表单
│   ├── Journal.tsx     # 投资手帐 ⭐ 核心功能
│   ├── Review.tsx      # 复盘分析
│   └── Settings.tsx    # 设置页面
├── types/              # TypeScript 类型定义
├── utils/              # 工具函数
│   ├── storage.ts      # 本地存储
│   ├── calculations.ts # 计算函数
│   └── demoData.ts     # 演示数据
├── i18n/               # 国际化
└── App.tsx             # 主应用组件
```

## 设计特色 / Design Features

### 字体与色彩 / Typography & Colors
- **字体**: Noto Serif SC (中文) + Serif (英文)
- **主色调**: 温暖的米白色背景 (#F7F7F5)
- **文字色**: 深灰色 (#37352F)
- **强调色**: 蓝色 (#2F5FD5)
- **状态色**: 绿色 (盈利) / 红色 (亏损)

### 响应式设计 / Responsive Design
- 优先考虑移动端体验
- 支持手机快速记录交易
- 自适应不同屏幕尺寸

### 数据存储 / Data Storage
- 使用浏览器本地存储
- 数据持久化
- 支持关键词自动保存
- 无需后端服务器

## 核心价值 / Core Value

这个工具的核心价值在于其"叙事性"和"自我进化能力"。它不仅仅是冷冰冰的数字，而是包含了每次决策背后的"故事"（宏观背景和个人思考），并且能够：

1. **轻松记录故事**：快速记录交易背景和逻辑
2. **方便回顾故事**：通过关键词筛选找到相关交易
3. **学习成长**：通过复盘总结积累经验
4. **沉淀智慧**：将经验固化为可复用的投资原则 ⭐
5. **自我进化**：投资决策支持系统能够不断改进 ⭐

## 投资手帐功能详解 / Investment Journal Details

### 原则卡片设计 / Principle Card Design
- **核心原则**：用加粗字体展示主要内容
- **来源指示**：用颜色和图标区分原则来源
- **通用原则**：基础卡片样式
- **复盘提炼**：左侧彩色竖线 + 交易链接

### 分类系统 / Category System
- **风险管理**：风险控制相关原则
- **心态纪律**：心理和纪律相关原则
- **入场策略**：买入时机和条件
- **出场策略**：卖出时机和条件
- **仓位管理**：资金分配和仓位控制

### 提炼流程 / Extraction Process
1. 用户在交易复盘中填写总结
2. 点击"提炼为原则"按钮
3. 系统智能预填充原则内容
4. 用户选择分类并保存
5. 新原则自动关联到源交易

## 部署说明 / Deployment

### Vercel 部署 / Vercel Deployment
1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 自动部署，获得公开访问链接
4. 支持自动更新

### 本地部署 / Local Deployment
```bash
npm run build
npm run preview
```

## 未来规划 / Future Plans

- [ ] 数据导出功能
- [ ] 更多图表分析
- [ ] 交易提醒功能
- [ ] 移动端应用
- [ ] 原则模板库
- [ ] 社区分享功能

## 贡献 / Contributing

欢迎提交 Issue 和 Pull Request！

Welcome to submit Issues and Pull Requests!

## 许可证 / License

MIT License 