import express, { Request, Response } from 'express';
import Message from '../models/Message';

const router = express.Router();

// Send message
router.post('/', async (req: Request, res: Response) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Get messages for user
router.get('/user/:userId', async (req: Request, res: Response) => {
  const messages = await Message.find({ receiver: req.params.userId });
  res.json(messages);
});

export default router;
