import express from 'express';
import Match from '../models/Match';

const router = express.Router();

// Create match
router.post('/', async (req, res) => {
  try {
    const { date, teamA, teamB, scoreA, scoreB } = req.body;
    const match = new Match({ date, teamA, teamB, scoreA, scoreB });
    await match.save();
    res.status(201).json(match);
  } catch (err) {
  res.status(400).json({ error: (err as Error).message });
  }
});

// Get all matches
router.get('/', async (req, res) => {
  const matches = await Match.find().populate('teamA teamB');
  res.json(matches);
});

export default router;
