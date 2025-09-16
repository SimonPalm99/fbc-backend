import express, { Request, Response } from 'express';
import Statistic from '../models/Statistic';

const router = express.Router();

// Get statistics for user
router.get('/user/:userId', async (req: Request, res: Response) => {
  const stats = await Statistic.findOne({ user: req.params.userId });
  res.json(stats);
});

// Update statistics
router.put('/user/:userId', async (req: Request, res: Response) => {
  try {
    const updated = await Statistic.findOneAndUpdate(
      { user: req.params.userId },
      req.body,
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

export default router;
