"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ForumPost_1 = __importDefault(require("../models/ForumPost"));
const router = express_1.default.Router();
// GET /posts (paginerad)
router.get('/posts', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const total = await ForumPost_1.default.countDocuments();
        const posts = await ForumPost_1.default.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('author');
        res.json({
            posts,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// POST /posts (skapa nytt inlägg)
router.post('/posts', async (req, res) => {
    try {
        console.log('POST /forum/posts req.body:', req.body);
        const post = new ForumPost_1.default(req.body);
        await post.save();
        res.status(201).json(post);
    }
    catch (err) {
        console.error('POST /forum/posts error:', err);
        res.status(400).json({ error: err.message });
    }
});
// Create post
router.post('/', async (req, res) => {
    try {
        const post = new ForumPost_1.default(req.body);
        await post.save();
        res.status(201).json(post);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// Get all posts
router.get('/', async (req, res) => {
    const posts = await ForumPost_1.default.find().populate('author');
    res.json(posts);
});
// Get single post
router.get('/:id', async (req, res) => {
    try {
        const post = await ForumPost_1.default.findById(req.params.id).populate('author');
        if (!post)
            return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// Update post
router.put('/:id', async (req, res) => {
    try {
        const post = await ForumPost_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!post)
            return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// Delete post
router.delete('/:id', async (req, res) => {
    try {
        const post = await ForumPost_1.default.findByIdAndDelete(req.params.id);
        if (!post)
            return res.status(404).json({ error: 'Post not found' });
        res.json({ message: 'Post deleted' });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// Add comment to post
const ForumComment_1 = __importDefault(require("../models/ForumComment"));
router.post('/:id/comment', async (req, res) => {
    try {
        const post = await ForumPost_1.default.findById(req.params.id);
        if (!post)
            return res.status(404).json({ error: 'Post not found' });
        const comment = new ForumComment_1.default(req.body);
        await comment.save();
        post.comments = post.comments || [];
        post.comments.push(comment._id);
        await post.save();
        res.json(post);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.default = router;
