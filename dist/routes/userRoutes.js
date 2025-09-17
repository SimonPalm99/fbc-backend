"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, profileImageUrl } = req.body;
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = new User_1.default({ name, email, password: hashedPassword, role, status: 'pending', profileImageUrl });
        await user.save();
        res.status(201).json(user);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ error: 'Invalid credentials' });
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || '', { expiresIn: '1d' });
        res.json({ token, user });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// Get all users
router.get('/', async (req, res) => {
    const users = await User_1.default.find();
    res.json(users);
});
// Get all pending users (for admin/coach approval)
// Approve user (set status to 'approved')
router.patch('/:id/approve', async (req, res) => {
    try {
        const user = await User_1.default.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get('/pending', async (req, res) => {
    try {
        const pendingUsers = await User_1.default.find({ status: 'pending' });
        res.json(pendingUsers);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
