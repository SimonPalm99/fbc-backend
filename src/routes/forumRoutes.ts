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
    // Skapa post med alla fält från frontend
    const post = new ForumPost({
      author: req.body.author,
      title: req.body.title,
      content: req.body.content,
      createdAt: req.body.createdAt || Date.now(),
      pinned: req.body.pinned || false,
      media: req.body.media,
      poll: req.body.poll,
      pollVotes: req.body.pollVotes,
      pollVoters: req.body.pollVoters,
      likes: req.body.likes || 0,
      comments: req.body.comments || []
    });
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
// Like/unlike a post
router.post('/:id/like', async (req: Request, res: Response) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const userId = req.body.userId;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });
    const index = post.likes?.findIndex(id => id.toString() === userId);
    if (index !== undefined && index >= 0) {
      post.likes?.splice(index, 1); // Unlike
    } else {
      post.likes?.push(userId); // Like
    }
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Vote in poll
router.post('/:id/poll', async (req: Request, res: Response) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post || !post.poll) return res.status(404).json({ error: 'Poll not found' });
    const { userId, optionIndex } = req.body;
    if (typeof optionIndex !== 'number' || !userId) return res.status(400).json({ error: 'Missing data' });
    if (post.poll.voters?.includes(userId)) return res.status(400).json({ error: 'Already voted' });
    post.poll.votes[optionIndex] = (post.poll.votes[optionIndex] || 0) + 1;
    post.poll.voters.push(userId);
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Add tags to post
router.post('/:id/tags', async (req: Request, res: Response) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const { tags } = req.body;
    if (!Array.isArray(tags)) return res.status(400).json({ error: 'Tags must be array' });
    post.tags = Array.from(new Set([...(post.tags || []), ...tags]));
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Like/unlike a comment
router.post('/comment/:commentId/like', async (req: Request, res: Response) => {
  try {
    const comment = await ForumComment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    const userId = req.body.userId;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });
    const index = comment.likes?.findIndex(id => id.toString() === userId);
    if (index !== undefined && index >= 0) {
      comment.likes?.splice(index, 1); // Unlike
    } else {
      comment.likes?.push(userId); // Like
    }
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});
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
