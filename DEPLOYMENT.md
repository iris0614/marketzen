# 观市 MarketZen - 部署指南

## 概述

观市 MarketZen 是一个社交化投资平台，包含前端 React 应用和后端 Node.js API 服务。本指南将帮助你部署整个系统。

## 系统架构

```
前端 (React + Vite) → 后端 API (Node.js + Express) → 数据库 (PostgreSQL + Redis)
```

## 部署选项

### 选项一：本地开发环境

#### 1. 环境要求
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Git

#### 2. 数据库设置

**PostgreSQL 设置：**
```bash
# 创建数据库
createdb marketzen

# 或者使用 psql
psql -U postgres
CREATE DATABASE marketzen;
```

**Redis 设置：**
```bash
# 启动 Redis 服务器
redis-server
```

#### 3. 后端部署

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 创建环境变量文件
cp env.example .env

# 编辑 .env 文件，配置数据库连接等信息
nano .env

# 启动开发服务器
npm run dev
```

#### 4. 前端部署

```bash
# 回到项目根目录
cd ..

# 安装依赖
npm install

# 创建环境变量文件
cp .env.example .env

# 编辑 .env 文件
nano .env

# 启动开发服务器
npm run dev
```

### 选项二：生产环境部署

#### 1. 使用 Vercel + Railway + Supabase

**前端部署 (Vercel)：**
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署前端
vercel --prod
```

**后端部署 (Railway)：**
```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录 Railway
railway login

# 创建新项目
railway init

# 部署后端
railway up
```

**数据库设置 (Supabase)：**
1. 注册 Supabase 账户
2. 创建新项目
3. 获取数据库连接字符串
4. 在 Railway 中设置环境变量

#### 2. 使用 Docker 部署

**创建 Docker Compose 文件：**

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:5000/api
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/marketzen
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=your-secret-key
      - NODE_ENV=production
    depends_on:
      - db
      - redis

  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=marketzen
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

**前端 Dockerfile：**
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**后端 Dockerfile：**
```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

**部署命令：**
```bash
# 构建和启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 环境变量配置

### 前端环境变量 (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENVIRONMENT=production
```

### 后端环境变量 (.env)
```env
# 服务器配置
PORT=5000
NODE_ENV=production

# 数据库配置
DATABASE_URL=postgresql://username:password@localhost:5432/marketzen
REDIS_URL=redis://localhost:6379

# JWT配置
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# 邮件配置
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# 文件上传配置
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# 跨域配置
CORS_ORIGIN=https://your-frontend-domain.com

# 安全配置
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 域名和 SSL 配置

### 使用 Nginx 反向代理

```nginx
# /etc/nginx/sites-available/marketzen
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # 前端
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 后端 API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 监控和日志

### 使用 PM2 管理 Node.js 进程

```bash
# 安装 PM2
npm install -g pm2

# 启动后端服务
pm2 start backend/dist/server.js --name "marketzen-api"

# 查看日志
pm2 logs marketzen-api

# 监控进程
pm2 monit
```

### 使用 Sentry 进行错误监控

```bash
# 安装 Sentry CLI
npm install -g @sentry/cli

# 初始化 Sentry
sentry-cli init
```

## 备份策略

### 数据库备份

```bash
# 创建备份脚本
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# PostgreSQL 备份
pg_dump $DATABASE_URL > $BACKUP_DIR/marketzen_$DATE.sql

# 压缩备份文件
gzip $BACKUP_DIR/marketzen_$DATE.sql

# 删除7天前的备份
find $BACKUP_DIR -name "marketzen_*.sql.gz" -mtime +7 -delete
```

### 文件备份

```bash
# 备份上传的文件
rsync -av /path/to/uploads/ /backups/uploads/
```

## 安全配置

### 防火墙设置

```bash
# 只开放必要端口
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### SSL 证书 (Let's Encrypt)

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo crontab -e
# 添加：0 12 * * * /usr/bin/certbot renew --quiet
```

## 性能优化

### 前端优化

1. **代码分割：**
```javascript
// 使用 React.lazy 进行代码分割
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
```

2. **图片优化：**
```javascript
// 使用 WebP 格式和懒加载
<img src="image.webp" loading="lazy" alt="description" />
```

3. **缓存策略：**
```javascript
// 设置适当的缓存头
Cache-Control: public, max-age=31536000
```

### 后端优化

1. **数据库索引：**
```sql
-- 为常用查询添加索引
CREATE INDEX idx_trades_user_id ON trades(user_id);
CREATE INDEX idx_trades_created_at ON trades(created_at);
```

2. **Redis 缓存：**
```javascript
// 缓存用户数据
const userCache = await redis.get(`user:${userId}`);
if (!userCache) {
  const user = await UserModel.findById(userId);
  await redis.setex(`user:${userId}`, 3600, JSON.stringify(user));
}
```

3. **API 限流：**
```javascript
// 使用 express-rate-limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制每个IP 15分钟内最多100个请求
});
```

## 故障排除

### 常见问题

1. **数据库连接失败：**
   - 检查数据库服务是否运行
   - 验证连接字符串
   - 确认防火墙设置

2. **Redis 连接失败：**
   - 检查 Redis 服务状态
   - 验证 Redis 配置
   - 确认端口是否开放

3. **JWT 认证失败：**
   - 检查 JWT_SECRET 环境变量
   - 验证 token 格式
   - 确认 token 是否过期

4. **CORS 错误：**
   - 检查 CORS_ORIGIN 配置
   - 确认前端域名是否正确
   - 验证后端 CORS 中间件

### 日志查看

```bash
# 查看应用日志
tail -f /var/log/marketzen/app.log

# 查看 Nginx 日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# 查看系统日志
journalctl -u marketzen-api -f
```

## 更新和维护

### 自动更新脚本

```bash
#!/bin/bash
# update.sh

# 拉取最新代码
git pull origin main

# 安装依赖
npm install
cd backend && npm install && cd ..

# 构建应用
npm run build
cd backend && npm run build && cd ..

# 重启服务
pm2 restart marketzen-api
pm2 restart marketzen-frontend
```

### 健康检查

```bash
# 检查服务状态
curl -f http://localhost:5000/health || exit 1
curl -f http://localhost:3000 || exit 1
```

## 联系和支持

如果在部署过程中遇到问题，请：

1. 查看日志文件
2. 检查环境变量配置
3. 验证网络连接
4. 联系技术支持团队

---

**注意：** 在生产环境中部署前，请确保：
- 更改所有默认密码
- 配置适当的 SSL 证书
- 设置防火墙规则
- 配置监控和备份
- 测试所有功能 