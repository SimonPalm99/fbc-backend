import express from 'express';
import Team from '../models/Team';

const router = express.Router();

// Create team
router.post('/', async (req, res) => {
  try {
    const { name, members } = req.body;
    const team = new Team({ name, members });
    await team.save();
    res.status(201).json(team);
  } catch (err) {
  res.status(400).json({ error: (err as Error).message });
  }
});

// Get all teams
router.get('/', async (req, res) => {
  const teams = await Team.find().populate('members');
  res.json(teams);
});

export default router;
