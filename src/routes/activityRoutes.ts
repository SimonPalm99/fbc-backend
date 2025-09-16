import express, { Request, Response } from 'express';
import Activity from '../models/Activity';

const router = express.Router();

// Get all activities
// GET /api/activities
router.get('/', async (req: Request, res: Response) => {
  try {
    const activities = await Activity.find();
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Get activity by id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('participants.userId').populate('comments.userId');
    if (!activity) {
      return res.status(404).json({ error: 'Aktivitet hittades inte' });
    }
    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Create activity
router.post('/', async (req: Request, res: Response) => {
  try {
    const activity = new Activity(req.body);
    await activity.save();
    res.status(201).json(activity);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Update activity
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updated = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Delete activity
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

export default router;
