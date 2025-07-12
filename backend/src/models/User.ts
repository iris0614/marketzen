import { pool } from '../config/database';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  username: string;
  password_hash: string;
  avatar_url?: string;
  bio?: string;
  investment_style?: string[];
  privacy_settings: {
    profile: 'public' | 'private' | 'followers';
    trades: 'public' | 'private' | 'followers';
    journal: 'public' | 'private' | 'followers';
    analysis: 'public' | 'private' | 'followers';
  };
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  email: string;
  username: string;
  password: string;
  bio?: string;
  investment_style?: string[];
}

export interface UpdateUserData {
  username?: string;
  avatar_url?: string;
  bio?: string;
  investment_style?: string[];
  privacy_settings?: Partial<User['privacy_settings']>;
}

export class UserModel {
  // 创建用户
  static async create(userData: CreateUserData): Promise<User> {
    const { email, username, password, bio, investment_style } = userData;
    
    // 加密密码
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    const query = `
      INSERT INTO users (email, username, password_hash, bio, investment_style)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const values = [email, username, password_hash, bio, investment_style];
    const result = await pool.query(query, values);
    
    return result.rows[0];
  }

  // 根据邮箱查找用户
  static async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    
    return result.rows[0] || null;
  }

  // 根据用户名查找用户
  static async findByUsername(username: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);
    
    return result.rows[0] || null;
  }

  // 根据ID查找用户
  static async findById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    return result.rows[0] || null;
  }

  // 更新用户信息
  static async update(id: string, userData: UpdateUserData): Promise<User | null> {
    const fields = Object.keys(userData).map((key, index) => `${key} = $${index + 2}`);
    const values = Object.values(userData);
    
    const query = `
      UPDATE users 
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, ...values]);
    return result.rows[0] || null;
  }

  // 验证密码
  static async verifyPassword(password: string, password_hash: string): Promise<boolean> {
    return bcrypt.compare(password, password_hash);
  }

  // 获取用户统计信息
  static async getStats(id: string) {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM trades WHERE user_id = $1) as total_trades,
        (SELECT COUNT(*) FROM trades WHERE user_id = $1 AND status = 'open') as open_trades,
        (SELECT COUNT(*) FROM principles WHERE user_id = $1) as total_principles,
        (SELECT COUNT(*) FROM follows WHERE follower_id = $1) as following_count,
        (SELECT COUNT(*) FROM follows WHERE following_id = $1) as followers_count
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // 搜索用户
  static async search(query: string, limit: number = 10): Promise<User[]> {
    const searchQuery = `
      SELECT * FROM users 
      WHERE username ILIKE $1 OR bio ILIKE $1
      ORDER BY created_at DESC
      LIMIT $2
    `;
    
    const result = await pool.query(searchQuery, [`%${query}%`, limit]);
    return result.rows;
  }

  // 获取关注列表
  static async getFollowing(userId: string): Promise<User[]> {
    const query = `
      SELECT u.* FROM users u
      INNER JOIN follows f ON u.id = f.following_id
      WHERE f.follower_id = $1
      ORDER BY f.created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // 获取粉丝列表
  static async getFollowers(userId: string): Promise<User[]> {
    const query = `
      SELECT u.* FROM users u
      INNER JOIN follows f ON u.id = f.follower_id
      WHERE f.following_id = $1
      ORDER BY f.created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // 检查是否关注
  static async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const query = 'SELECT 1 FROM follows WHERE follower_id = $1 AND following_id = $2';
    const result = await pool.query(query, [followerId, followingId]);
    
    return result.rows.length > 0;
  }

  // 关注用户
  static async follow(followerId: string, followingId: string): Promise<void> {
    const query = 'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING';
    await pool.query(query, [followerId, followingId]);
  }

  // 取消关注
  static async unfollow(followerId: string, followingId: string): Promise<void> {
    const query = 'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2';
    await pool.query(query, [followerId, followingId]);
  }
} 