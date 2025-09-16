import express, { Request, Response } from 'express';
import Attendance from '../models/Attendance';

const router = express.Router();

// Mark attendance
router.post('/', async (req: Request, res: Response) => {
  try {
    const attendance = new Attendance(req.body);
    await attendance.save();
    res.status(201).json(attendance);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Get attendance for user
router.get('/user/:userId', async (req: Request, res: Response) => {
  const attendance = await Attendance.find({ user: req.params.userId });
  res.json(attendance);
});

export default router;
