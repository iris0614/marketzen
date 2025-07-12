import { Router } from 'express';

const router = Router();

// 获取投资原则列表
router.get('/', (req, res) => {
  res.json({ message: 'Get principles list endpoint' });
});

// 创建投资原则
router.post('/', (req, res) => {
  res.json({ message: 'Create principle endpoint' });
});

// 获取投资原则详情
router.get('/:id', (req, res) => {
  res.json({ message: 'Get principle detail endpoint' });
});

// 更新投资原则
router.put('/:id', (req, res) => {
  res.json({ message: 'Update principle endpoint' });
});

// 删除投资原则
router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete principle endpoint' });
});

// 更新原则隐私设置
router.put('/:id/privacy', (req, res) => {
  res.json({ message: 'Update principle privacy endpoint' });
});

export default router; 