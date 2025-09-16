import express, { Request, Response } from 'express';
import Fine from '../models/Fine';

const router = express.Router();

// Create fine
router.post('/', async (req: Request, res: Response) => {
  try {
    const fine = new Fine(req.body);
    await fine.save();
    res.status(201).json(fine);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Get fines for user
router.get('/user/:userId', async (req: Request, res: Response) => {
  const fines = await Fine.find({ user: req.params.userId });
  res.json(fines);
});

export default router;
