import express from 'express';
import Absence from '../models/Absence';

const router = express.Router();

// GET /api/absences - hämta alla frånvaroanmälningar
router.get('/', async (req, res) => {
  try {
    const absences = await Absence.find().sort({ date: -1 });
    res.json(absences);
  } catch (err) {
    res.status(500).json({ error: 'Kunde inte hämta frånvaroanmälningar.' });
  }
});

// POST /api/absences - skapa ny frånvaroanmälan
router.post('/', async (req, res) => {
  try {
    const absence = new Absence(req.body);
    await absence.save();
    res.status(201).json(absence);
  } catch (err) {
    res.status(400).json({ error: 'Kunde inte spara frånvaroanmälan.' });
  }
});

export default router;
