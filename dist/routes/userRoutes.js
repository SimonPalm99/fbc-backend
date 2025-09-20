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
        console.log('POST /register', req.body); // Logga inkommande request
        // Hantera både gamla och nya fält från frontend
        let { name, email, password, role, profileImageUrl, username, firstName, lastName, confirmPassword } = req.body;
        // Om name saknas men firstName och lastName finns, skapa name
        if (!name && firstName && lastName) {
            name = `${firstName} ${lastName}`;
        }
        // Om name saknas men username finns, använd username
        if (!name && username) {
            name = username;
        }
        // Acceptera även om bara name finns (från befintligt formulär)
        if (name && !firstName && !lastName) {
            // Dela upp name till förnamn och efternamn om möjligt
            const nameParts = name.trim().split(' ');
            firstName = nameParts[0] || '';
            lastName = nameParts.slice(1).join(' ') || '';
        }
        // Validera lösenord
        if (confirmPassword && password !== confirmPassword) {
            return res.status(400).json({ error: 'Lösenorden matchar inte' });
        }
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Namn, e-post och lösenord krävs' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = new User_1.default({ name, email, password: hashedPassword, role: role || 'player', status: 'pending', profileImageUrl });
        try {
            const savedUser = await user.save();
            console.log('User sparad:', savedUser);
            res.status(201).json(savedUser);
        }
        catch (saveErr) {
            console.error('Fel vid user.save():', saveErr);
            return res.status(400).json({ error: saveErr.message || JSON.stringify(saveErr) });
        }
    }
    catch (err) {
        // Logga hela felet till konsolen
        console.error('Register error:', err);
        const errorObj = err;
        // Om det är en Mongoose validation error, skicka detaljer
        if (errorObj.errors) {
            const errorDetails = Object.values(errorObj.errors).map((e) => e.message);
            return res.status(400).json({ error: errorDetails.join(', ') });
        }
        // Om det är en duplikatnyckel (t.ex. email)
        if (errorObj.code === 11000) {
            return res.status(400).json({ error: 'E-postadressen är redan registrerad.' });
        }
        // Annars skicka hela felet
        res.status(400).json({ error: errorObj.message || JSON.stringify(errorObj) });
    }
});
// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', email, password);
        const user = await User_1.default.findOne({ email });
        console.log('User found:', user);
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        console.log('Password match:', isMatch);
        if (!isMatch)
            return res.status(401).json({ error: 'Invalid credentials' });
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || '', { expiresIn: '1d' });
        res.json({
            user,
            tokens: {
                accessToken: token,
                refreshToken: token, // För nu använder vi samma token
                expiresIn: 86400 // 24 timmar i sekunder
            }
        });
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
