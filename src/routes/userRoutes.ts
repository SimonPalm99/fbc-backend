// Utöka Express Request-typen med user-property
import { Request } from 'express';
declare module 'express-serve-static-core' {
  interface Request {
    user?: string;
  }
}
import express from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken, requireLeaderOrAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();
// Hämta aktuell användare baserat på token
router.get('/me', authenticateToken, async (req, res) => {
  try {
    // auth-middleware sätter req.userId
  // auth-middleware sätter req.user till userId
  const userId = req.user;
    if (!userId) return res.status(401).json({ error: 'Ingen användare hittades' });
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'Användaren finns inte' });
  // Returnera _id som sträng och även id
  const userObj = user.toObject();
  userObj._id = user._id.toString();
  userObj.id = user._id.toString();
  res.json({ success: true, data: userObj });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

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

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role: role || 'player', status: 'pending', profileImageUrl });
    try {
      const savedUser = await user.save();
      console.log('User sparad:', savedUser);
      res.status(201).json(savedUser);
    } catch (saveErr: any) {
      console.error('Fel vid user.save():', saveErr);
      return res.status(400).json({ error: saveErr.message || JSON.stringify(saveErr) });
    }
  } catch (err) {
    // Logga hela felet till konsolen
    console.error('Register error:', err);
    const errorObj = err as any;
    // Om det är en Mongoose validation error, skicka detaljer
    if (errorObj.errors) {
      const errorDetails = Object.values(errorObj.errors).map((e: any) => e.message);
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
    const user = await User.findOne({ email });
    console.log('User found:', user);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
    const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || '', { expiresIn: '1d' });
    // Skapa en dummy refreshToken (implementera riktig om du vill ha refresh-flöde)
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || '', { expiresIn: '7d' });
    res.cookie('fbc_access_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none', // viktigt för cross-origin!
      maxAge: 86400000 // 1 dag
    });
    res.json({
      user,
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 86400 // sekunder (1 dag)
      }
    });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Get all users
router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Get all pending users (for admin/coach approval)
// Approve user (set status to 'approved')
router.patch('/:id/approve', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});
router.get('/pending', async (req, res) => {
  try {
    const pendingUsers = await User.find({ status: 'pending' });
    res.json(pendingUsers);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
