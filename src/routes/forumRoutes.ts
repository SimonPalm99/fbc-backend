import express, { Request, Response } from 'express';
import ForumPost from '../models/ForumPost';

const router = express.Router();

// GET /posts (paginerad)
router.get('/posts', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const total = await ForumPost.countDocuments();
    const posts = await ForumPost.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author');
    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// POST /posts (skapa nytt inlägg)
router.post('/posts', async (req: Request, res: Response) => {
  try {
    console.log('POST /forum/posts req.body:', req.body);
    const post = new ForumPost(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error('POST /forum/posts error:', err);
    res.status(400).json({ error: (err as Error).message });
  }
});

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
    res.json({ message: 'Post deleted' });
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
