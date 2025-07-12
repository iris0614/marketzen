import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';

// 加载环境变量
dotenv.config();

const app = express();

// 安全中间件
app.use(helmet());

// 跨域配置
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// 请求限流
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15分钟
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 限制每个IP 15分钟内最多100个请求
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api/', limiter);

// 解析JSON请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'MarketZen API',
    version: '1.0.0'
  });
});

// API路由
app.use('/api/auth', require('./routes/auth').default);
app.use('/api/users', require('./routes/users').default);
app.use('/api/trades', require('./routes/trades').default);
app.use('/api/principles', require('./routes/principles').default);
app.use('/api/feed', require('./routes/feed').default);

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ 
      error: 'Bad Request',
      message: 'Invalid JSON format'
    });
  }
  
  return res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 初始化数据库
initializeDatabase().then(() => {
  console.log('Database initialized successfully');
}).catch((error) => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});

export default app;
