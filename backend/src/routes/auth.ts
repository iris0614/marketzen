import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { UserModel } from '../models/User';
import { generateToken } from '../middleware/auth';

const router = Router();

// 用户注册
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('username').isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/),
  body('password').isLength({ min: 6 }),
  body('bio').optional().isLength({ max: 500 }),
  body('investment_style').optional().isArray(),
], async (req: Request, res: Response) => {
  try {
    // 验证输入
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array() 
      });
    }

    const { email, username, password, bio, investment_style } = req.body;

    // 检查邮箱是否已存在
    const existingEmail = await UserModel.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ 
        error: 'Email already registered' 
      });
    }

    // 检查用户名是否已存在
    const existingUsername = await UserModel.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ 
        error: 'Username already taken' 
      });
    }

    // 创建用户
    const user = await UserModel.create({
      email,
      username,
      password,
      bio,
      investment_style,
    });

    // 生成JWT Token
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    // 返回用户信息（不包含密码）
    const { password_hash, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// 用户登录
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], async (req: Request, res: Response) => {
  try {
    // 验证输入
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array() 
      });
    }

    const { email, password } = req.body;

    // 查找用户
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // 验证密码
    const isValidPassword = await UserModel.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // 生成JWT Token
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    // 返回用户信息（不包含密码）
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// 获取当前用户信息
router.get('/me', async (req: Request, res: Response) => {
  try {
    // 这里需要认证中间件，暂时简化处理
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        error: 'Authentication required' 
      });
    }

    // 实际应该使用认证中间件
    res.json({ 
      message: 'Current user info endpoint' 
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

export default router; 