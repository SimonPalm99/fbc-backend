import express from 'express';
import Training from '../models/Training';

const router = express.Router();

// Create training
router.post('/', async (req, res) => {
  try {
    const { date, team, description } = req.body;
    const training = new Training({ date, team, description });
    await training.save();
    res.status(201).json(training);
  } catch (err) {
  res.status(400).json({ error: (err as Error).message });
  }
});

// Get all trainings
router.get('/', async (req, res) => {
  const trainings = await Training.find().populate('team');
  res.json(trainings);
});

export default router;
