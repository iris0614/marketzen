const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// 中间件
app.use(cors({
  origin: 'http://localhost:3002',
  credentials: true
}));

app.use(express.json());

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'MarketZen API',
    version: '1.0.0'
  });
});

// 测试API
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 MarketZen API Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
}); 