# MarketZen

A minimalist, intuitive, and efficient investment trading record tool focused on macro background analysis, trade review, and a self-evolving investment decision support system.

## Core Design Philosophy

### Simplicity
- Generous whitespace, content-focused
- Avoid unnecessary decoration and borders
- Clear information hierarchy

### Intuitive
- Features and operations follow user intuition
- No learning curve
- Inspired by Apple design language

### Efficient
- Fast recording and review
- Key information at a glance
- Mobile-friendly

## Key Features

- **Welcome Page**: Elegant animation, bilingual support, Zen-inspired design
- **Dashboard**: Key metrics (PnL, win rate, positions), categorized trades, clear trade info
- **New/Edit Trade**: Record macro background, trade logic, details, plans, and review
- **Investment Journal**: Core feature for evolving your investment principles, with card-based design, categorization, and trade linkage
- **Review & Analysis**: Filter trades by macro keywords, search, multi-filter, and statistics
- **Settings**: Language and currency options

## Optimized User Journey

1. **Think**: Write down core principles in the Investment Journal
2. **Plan**: Record trade background and plan in New Trade
3. **Execute**: Complete trade with your broker
4. **Review**: Fill in trade review and summary
5. **Grow**: Extract new principles from reviews and link them to trades

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Data Storage**: Local Storage (pure frontend, no backend)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

The app will be available at the local address shown in your terminal (usually http://localhost:3000/).

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build Locally
```bash
npm run preview
```

## Project Structure

```
src/
├── components/      # Reusable UI components
├── pages/           # Page components (Welcome, Dashboard, TradeForm, Journal, Review, Settings)
├── types/           # TypeScript type definitions
├── utils/           # Utility functions (storage, calculations, demo data)
├── i18n/            # Internationalization
└── App.tsx          # Main app component
```

## Design Features

- **Typography**: Noto Serif SC (Chinese) + Serif (English)
- **Color Scheme**: Warm off-white background (#F7F7F5), dark gray text (#37352F), blue accent (#2F5FD5), green/red for PnL
- **Responsive**: Mobile-first, adapts to all screen sizes
- **Data Storage**: Browser local storage, no backend required

## Core Value

MarketZen's core value lies in its narrative and self-evolving capability. It helps you:

1. **Easily record the story** behind each trade
2. **Conveniently review** trades by keyword
3. **Learn and grow** through trade reviews
4. **Condense wisdom** into reusable investment principles
5. **Continuously improve** your decision-making system

## Investment Journal Details

- **Principle Cards**: Bold for main content, color/icon for source, trade linkage for review-derived principles
- **Categories**: Risk management, discipline, entry/exit strategies, position sizing
- **Extraction Flow**: Summarize in review, extract as principle, categorize, and auto-link to trade

## Local Usage Only

> **Note:** This project is a pure frontend application. There is no backend or online deployment included by default. All data is stored in your browser's local storage. To use the app, follow the Quick Start instructions above to run it locally.

## License

MIT License 