import { Router } from 'express';
import CheckInOut from '../models/CheckInOut';

const router = Router();

// Spara check in/out
router.post('/', async (req, res) => {
  try {
    const check = new CheckInOut(req.body);
    await check.save();
    res.status(201).json(check);
  } catch (err) {
    res.status(400).json({ error: 'Kunde inte spara check in/out.' });
  }
});

// Hämta alla check in/out
router.get('/', async (req, res) => {
  try {
    const checks = await CheckInOut.find();
    res.json(checks);
  } catch (err) {
    res.status(500).json({ error: 'Kunde inte hämta check in/out.' });
  }
});

// Hämta check in/out för en aktivitet
router.get('/activity/:activityId', async (req, res) => {
  try {
    const checks = await CheckInOut.find({ activityId: req.params.activityId });
    res.json(checks);
  } catch (err) {
    res.status(500).json({ error: 'Kunde inte hämta check in/out för aktivitet.' });
  }
});

export default router;
