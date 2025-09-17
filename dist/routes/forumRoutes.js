"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ForumPost_1 = __importDefault(require("../models/ForumPost"));
const router = express_1.default.Router();
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
exports.default = router;
