import { Pool } from 'pg';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL 连接池
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Redis 客户端
export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err: any) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('Redis Client Connected');
});

// 数据库初始化
export const initializeDatabase = async () => {
  try {
    // 测试数据库连接
    const client = await pool.connect();
    console.log('PostgreSQL Connected');
    client.release();

    // 连接Redis
    await redisClient.connect();

    // 创建数据库表
    await createTables();
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

// 创建数据库表
const createTables = async () => {
  const client = await pool.connect();
  
  try {
    // 用户表
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
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
    `);

    // 交易记录表
    await client.query(`
      CREATE TABLE IF NOT EXISTS trades (
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
    `);

    // 投资手帐表
    await client.query(`
      CREATE TABLE IF NOT EXISTS principles (
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
    `);

    // 关注关系表
    await client.query(`
      CREATE TABLE IF NOT EXISTS follows (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
        following_id UUID REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(follower_id, following_id)
      );
    `);

    // 互动表
    await client.query(`
      CREATE TABLE IF NOT EXISTS interactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        content_type VARCHAR(20) NOT NULL,
        content_id UUID NOT NULL,
        interaction_type VARCHAR(20) NOT NULL,
        content TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default pool; 