import { Router } from 'express';

const router = Router();

// 获取关注用户的动态
router.get('/', (req, res) => {
  res.json({ message: 'Get feed endpoint' });
});

// 获取推荐内容
router.get('/explore', (req, res) => {
  res.json({ message: 'Get explore content endpoint' });
});

// 创建互动（点赞、评论）
router.post('/interactions', (req, res) => {
  res.json({ message: 'Create interaction endpoint' });
});

// 删除互动
router.delete('/interactions/:id', (req, res) => {
  res.json({ message: 'Delete interaction endpoint' });
});

export default router; 