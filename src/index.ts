// ...existing code...
import express from 'express';
const cookieParser = require('cookie-parser');
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import teamRoutes from './routes/teamRoutes';
import matchRoutes from './routes/matchRoutes';
import trainingRoutes from './routes/trainingRoutes';
import profileRoutes from './routes/profileRoutes';
import fineRoutes from './routes/fineRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import messageRoutes from './routes/messageRoutes';
import chatRoomRoutes from './routes/chatRoomRoutes';
import forumRoutes from './routes/forumRoutes';
import statisticRoutes from './routes/statisticRoutes';
import activityRoutes from './routes/activityRoutes';
import cashRoutes from './routes/cashRoutes';
import rulesRoutes from './routes/rulesRoutes';
import absenceRoutes from './routes/absenceRoutes';
import checkInOutRoutes from './routes/checkInOutRoutes';
import checkQuestionRoutes from './routes/checkQuestionRoutes';

dotenv.config();


const app = express();
app.use(cors({
  origin: 'https://fbc-nykoping-lagapp.vercel.app',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Logging middleware för alla requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/trainings', trainingRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/fines', fineRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/chatrooms', chatRoomRoutes);
// Extra logging för forum routes
app.use('/api/forum', (req, res, next) => {
  console.log('Forum route hit:', req.method, req.url);
  next();
}, forumRoutes);
app.use('/api/statistics', statisticRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/cash', cashRoutes);
app.use('/api/rules', rulesRoutes);
app.use('/api/absences', absenceRoutes);


app.use('/api/checks', checkInOutRoutes);
app.use('/api/check-questions', checkQuestionRoutes);

// Test-endpoint för att verifiera server och databas
app.get('/api/test', async (req, res) => {
  let dbStatus = 'unknown';
  try {
    // Testa en enkel MongoDB-operation
    await mongoose.connection.db.admin().ping();
    dbStatus = 'connected';
  } catch (err) {
    dbStatus = 'error: ' + (err instanceof Error ? err.message : String(err));
  }
  res.json({
    server: 'ok',
    mongo: dbStatus,
    time: new Date().toISOString()
  });
});

const PORT = Number(process.env.PORT) || 5000;
const MONGO_URI = process.env.MONGO_URI || '';
console.log('Trying to connect to MongoDB:', MONGO_URI);
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connection successful');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err: any) => {
    console.error('Database connection error:', err);
  });
