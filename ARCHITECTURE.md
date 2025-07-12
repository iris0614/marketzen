# 观市 MarketZen - 社交化投资平台架构设计

## 系统概述
观市 MarketZen 是一个集个人投资记录、社交分享、智慧学习于一体的投资平台。

## 核心功能模块

### 1. 用户系统
- **用户注册/登录**：邮箱、密码、用户名
- **用户资料**：头像、简介、投资风格标签
- **隐私设置**：个人资料可见性控制

### 2. 投资记录系统
- **个人交易记录**：完整的交易数据
- **投资手帐**：个人投资原则和心得
- **复盘分析**：交易总结和经验提炼

### 3. 社交分享系统
- **公开设置**：
  - 完全私密（仅自己可见）
  - 仅投资手帐公开
  - 仅仪表盘公开
  - 仅复盘分析公开
  - 全部公开
- **分享功能**：
  - 分享到社区
  - 生成分享链接
  - 嵌入到其他网站

### 4. 社区互动系统
- **关注机制**：关注其他投资者
- **点赞/收藏**：对公开内容进行互动
- **评论系统**：对公开内容进行讨论
- **推荐算法**：基于兴趣推荐内容

## 技术架构

### 前端技术栈
- **React + TypeScript**：用户界面
- **Tailwind CSS**：样式设计
- **React Router**：路由管理
- **React Query**：数据获取和缓存
- **Zustand**：状态管理

### 后端技术栈
- **Node.js + Express**：API服务器
- **PostgreSQL**：主数据库
- **Redis**：缓存和会话存储
- **JWT**：身份认证
- **Multer**：文件上传
- **Nodemailer**：邮件服务

### 部署架构
- **Vercel**：前端部署
- **Railway/Render**：后端部署
- **Supabase**：数据库服务
- **Cloudinary**：图片存储

## 数据库设计

### 用户表 (users)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  bio TEXT,
  investment_style VARCHAR(100)[],
  privacy_settings JSONB DEFAULT '{"profile": "public", "trades": "private", "journal": "private", "analysis": "private"}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 交易记录表 (trades)
```sql
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  asset VARCHAR(50) NOT NULL,
  direction VARCHAR(10) NOT NULL,
  entry_price DECIMAL(15,8) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  portfolio_percentage DECIMAL(5,2),
  take_profit DECIMAL(15,8),
  stop_loss DECIMAL(15,8),
  macro_context TEXT[],
  thesis TEXT,
  status VARCHAR(20) DEFAULT 'open',
  exit_price DECIMAL(15,8),
  post_mortem_notes TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  closed_at TIMESTAMP
);
```

### 投资手帐表 (principles)
```sql
CREATE TABLE principles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  type VARCHAR(20) DEFAULT 'general',
  source_trade_id UUID REFERENCES trades(id),
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 关注关系表 (follows)
```sql
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);
```

### 互动表 (interactions)
```sql
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content_type VARCHAR(20) NOT NULL, -- 'trade', 'principle'
  content_id UUID NOT NULL,
  interaction_type VARCHAR(20) NOT NULL, -- 'like', 'comment', 'share'
  content TEXT, -- for comments
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API 设计

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/me` - 获取当前用户信息

### 用户相关
- `GET /api/users/:id` - 获取用户信息
- `PUT /api/users/:id` - 更新用户信息
- `POST /api/users/:id/follow` - 关注用户
- `DELETE /api/users/:id/follow` - 取消关注
- `GET /api/users/:id/followers` - 获取粉丝列表
- `GET /api/users/:id/following` - 获取关注列表

### 交易相关
- `GET /api/trades` - 获取交易列表
- `POST /api/trades` - 创建交易记录
- `GET /api/trades/:id` - 获取交易详情
- `PUT /api/trades/:id` - 更新交易记录
- `DELETE /api/trades/:id` - 删除交易记录
- `PUT /api/trades/:id/privacy` - 更新交易隐私设置

### 手帐相关
- `GET /api/principles` - 获取投资原则列表
- `POST /api/principles` - 创建投资原则
- `GET /api/principles/:id` - 获取投资原则详情
- `PUT /api/principles/:id` - 更新投资原则
- `DELETE /api/principles/:id` - 删除投资原则
- `PUT /api/principles/:id/privacy` - 更新原则隐私设置

### 社交相关
- `GET /api/feed` - 获取关注用户的动态
- `GET /api/explore` - 获取推荐内容
- `POST /api/interactions` - 创建互动（点赞、评论）
- `DELETE /api/interactions/:id` - 删除互动

## 隐私控制策略

### 1. 内容可见性
- **私密**：仅创建者可见
- **公开**：所有用户可见
- **关注者可见**：仅关注者可见

### 2. 数据保护
- 敏感信息加密存储
- API 访问权限控制
- 用户数据导出功能
- 账户删除功能

### 3. 内容审核
- 自动内容过滤
- 用户举报机制
- 管理员审核系统

## 部署计划

### 阶段一：基础功能
1. 用户注册登录系统
2. 个人投资记录功能
3. 基础隐私设置

### 阶段二：社交功能
1. 用户关注系统
2. 内容分享功能
3. 互动功能（点赞、评论）

### 阶段三：高级功能
1. 推荐算法
2. 数据分析
3. 移动端适配

## 安全考虑

1. **数据加密**：敏感数据加密存储
2. **API 安全**：JWT 认证，请求限流
3. **XSS/CSRF 防护**：输入验证，CSRF Token
4. **SQL 注入防护**：参数化查询
5. **文件上传安全**：文件类型验证，大小限制 