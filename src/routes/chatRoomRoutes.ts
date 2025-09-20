import express, { Request, Response } from 'express';
import ChatRoom from '../models/ChatRoom';

const router = express.Router();

// Skapa ny grupp
router.post('/', async (req: Request, res: Response) => {
  try {
    const chatRoom = new ChatRoom(req.body);
    await chatRoom.save();
    res.status(201).json(chatRoom);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Hämta alla grupper där användaren är deltagare
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const rooms = await ChatRoom.find({ participants: req.params.userId });
    res.json(rooms);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Ta bort grupp
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await ChatRoom.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

export default router;
