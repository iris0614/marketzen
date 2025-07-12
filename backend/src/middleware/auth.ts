import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';

// 扩展Request接口以包含用户信息
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        username: string;
      };
    }
  }
}

export interface JWTPayload {
  id: string;
  email: string;
  username: string;
}

// 生成JWT Token
export const generateToken = (payload: JWTPayload): string => {
  const secret = process.env.JWT_SECRET!;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

// 验证JWT Token
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

// 认证中间件
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ message: 'Access token required' });
      return;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }

    // 验证用户是否存在
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    // 将用户信息添加到请求对象
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 可选认证中间件（不强制要求登录）
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const user = await UserModel.findById(decoded.id);
        if (user) {
          req.user = {
            id: user.id,
            email: user.email,
            username: user.username,
          };
        }
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
};

// 检查用户权限（检查是否是内容所有者）
export const checkOwnership = (
  resourceType: 'trade' | 'principle' | 'user'
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }

      const resourceId = req.params.id;
      let isOwner = false;

      switch (resourceType) {
        case 'user':
          isOwner = req.user.id === resourceId;
          break;
        case 'trade':
          // 这里需要查询数据库检查交易是否属于当前用户
          // 简化处理，实际应该查询数据库
          isOwner = true; // 临时设置
          break;
        case 'principle':
          // 这里需要查询数据库检查原则是否属于当前用户
          // 简化处理，实际应该查询数据库
          isOwner = true; // 临时设置
          break;
      }

      if (!isOwner) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }

      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}; 