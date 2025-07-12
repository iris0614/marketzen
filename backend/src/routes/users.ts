import { Router } from 'express';

const router = Router();

// 获取用户信息
router.get('/:id', (req, res) => {
  res.json({ message: 'Get user info endpoint' });
});

// 更新用户信息
router.put('/:id', (req, res) => {
  res.json({ message: 'Update user info endpoint' });
});

// 关注用户
router.post('/:id/follow', (req, res) => {
  res.json({ message: 'Follow user endpoint' });
});

// 取消关注
router.delete('/:id/follow', (req, res) => {
  res.json({ message: 'Unfollow user endpoint' });
});

// 获取关注列表
router.get('/:id/following', (req, res) => {
  res.json({ message: 'Get following list endpoint' });
});

// 获取粉丝列表
router.get('/:id/followers', (req, res) => {
  res.json({ message: 'Get followers list endpoint' });
});

export default router; 