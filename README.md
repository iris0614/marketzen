# 观市 MarketZen

极简本地投资手帐。记录交易、沉淀原则、复盘成长。数据只存在你的浏览器里，无需注册，也不上传云端。

**在线使用：** [https://marketzen-app.vercel.app/](https://marketzen-app.vercel.app/)

[![Live Demo](https://img.shields.io/badge/在线使用-marketzen--app.vercel.app-C4785A?style=for-the-badge&logo=vercel&logoColor=white)](https://marketzen-app.vercel.app/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-4-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)

---

## 功能

- **仪表盘**：持仓、盈亏、胜率与交易列表一览
- **交易记录**：标的、方向、价格、仓位、宏观背景、交易笔记；支持现货 / 合约、交易日期与 VIX
- **投资手帐**：自定义分类与颜色，把复盘教训提炼成可复用的原则
- **读书笔记**：投资相关书摘与标签筛选
- **日记**：按日记录市场观察与个人思考
- **复盘分析**：按盈亏、关键词、日期筛选已平仓交易
- **数据备份**：设置页导出 / 导入全部本地数据
- **中英双语**：界面可随时切换

所有数据保存在浏览器 `localStorage`。换设备或清缓存前，请先导出备份。

## 在线使用

打开即可用，不需要安装：

**[https://marketzen-app.vercel.app/](https://marketzen-app.vercel.app/)**

## 本地运行

需要 Node.js 18+。

```bash
git clone https://github.com/iris0614/marketzen.git
cd marketzen
npm install
npm run dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000)。

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 生产构建 |
| `npm run preview` | 预览构建结果 |

## 技术栈

React 18 · TypeScript · Vite · Tailwind CSS · React Router · Recharts

前端部署在 [Vercel](https://vercel.com/)。

## License

MIT
