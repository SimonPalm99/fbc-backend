import express, { Request, Response } from 'express';
import Profile from '../models/Profile';

const router = express.Router();

// Get profile by user
router.get('/:userId', async (req: Request, res: Response) => {
  const profile = await Profile.findOne({ user: req.params.userId });
  res.json(profile);
});

// Update profile
router.put('/:userId', async (req: Request, res: Response) => {
  try {
    const updated = await Profile.findOneAndUpdate(
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
