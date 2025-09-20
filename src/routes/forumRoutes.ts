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

// Get single post
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const post = await ForumPost.findById(req.params.id).populate('author');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Update post
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const post = await ForumPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Delete post
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const post = await ForumPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Add comment to post
import ForumComment from '../models/ForumComment';
router.post('/:id/comment', async (req: Request, res: Response) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const comment = new ForumComment(req.body);
    await comment.save();
    post.comments = post.comments || [];
    post.comments.push(comment._id);
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

export default router;
