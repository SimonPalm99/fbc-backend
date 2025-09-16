import { Router } from 'express';
import CheckQuestion from '../models/CheckQuestion';

const router = Router();

// Hämta alla frågor
router.get('/', async (req, res) => {
  try {
    const questions = await CheckQuestion.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Kunde inte hämta frågor.' });
  }
});

// Skapa ny fråga
router.post('/', async (req, res) => {
  try {
    const question = new CheckQuestion(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ error: 'Kunde inte skapa fråga.' });
  }
});

// Uppdatera fråga
router.put('/:id', async (req, res) => {
  try {
    const updated = await CheckQuestion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Kunde inte uppdatera fråga.' });
  }
});

// Ta bort fråga
router.delete('/:id', async (req, res) => {
  try {
    await CheckQuestion.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Kunde inte ta bort fråga.' });
  }
});

export default router;
