import express, { Request, Response } from 'express';
import ForumPost from '../models/ForumPost';

const router = express.Router();

// Create post
router.post('/', async (req: Request, res: Response) => {
  try {
    const post = new ForumPost(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Get all posts
router.get('/', async (req: Request, res: Response) => {
  const posts = await ForumPost.find().populate('author');
  res.json(posts);
});

export default router;
