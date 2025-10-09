"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ...existing code...
const express_1 = __importDefault(require("express"));
const cookieParser = require('cookie-parser');
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const teamRoutes_1 = __importDefault(require("./routes/teamRoutes"));
const matchRoutes_1 = __importDefault(require("./routes/matchRoutes"));
const trainingRoutes_1 = __importDefault(require("./routes/trainingRoutes"));
const profileRoutes_1 = __importDefault(require("./routes/profileRoutes"));
const fineRoutes_1 = __importDefault(require("./routes/fineRoutes"));
const attendanceRoutes_1 = __importDefault(require("./routes/attendanceRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const chatRoomRoutes_1 = __importDefault(require("./routes/chatRoomRoutes"));
const forumRoutes_1 = __importDefault(require("./routes/forumRoutes"));
const statisticRoutes_1 = __importDefault(require("./routes/statisticRoutes"));
const activityRoutes_1 = __importDefault(require("./routes/activityRoutes"));
const cashRoutes_1 = __importDefault(require("./routes/cashRoutes"));
const rulesRoutes_1 = __importDefault(require("./routes/rulesRoutes"));
const absenceRoutes_1 = __importDefault(require("./routes/absenceRoutes"));
const checkInOutRoutes_1 = __importDefault(require("./routes/checkInOutRoutes"));
const checkQuestionRoutes_1 = __importDefault(require("./routes/checkQuestionRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// CORS-middleware först!
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'https://fbc-nykoping-lagapp.vercel.app'];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // Tillåt requests utan origin (t.ex. curl, Postman)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        else {
            return callback(new Error('Not allowed by CORS'), false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Set-Cookie']
}));
// Generell OPTIONS-handler för alla routes
// ...sedan övrig middleware
app.use(cookieParser());
app.use(express_1.default.json());
// Generell OPTIONS-handler för alla /api/* routes
// Logging middleware för alla requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
app.use('/api/users', userRoutes_1.default);
app.use('/api/teams', teamRoutes_1.default);
app.use('/api/matches', matchRoutes_1.default);
app.use('/api/trainings', trainingRoutes_1.default);
app.use('/api/profiles', profileRoutes_1.default);
app.use('/api/fines', fineRoutes_1.default);
app.use('/api/attendance', attendanceRoutes_1.default);
app.use('/api/messages', messageRoutes_1.default);
app.use('/api/chatrooms', chatRoomRoutes_1.default);
// Extra logging för forum routes
app.use('/api/forum', (req, res, next) => {
    console.log('Forum route hit:', req.method, req.url);
    next();
}, forumRoutes_1.default);
app.use('/api/statistics', statisticRoutes_1.default);
app.use('/api/activities', activityRoutes_1.default);
app.use('/api/cash', cashRoutes_1.default);
app.use('/api/rules', rulesRoutes_1.default);
app.use('/api/absences', absenceRoutes_1.default);
app.use('/api/checks', checkInOutRoutes_1.default);
app.use('/api/check-questions', checkQuestionRoutes_1.default);
// Test-endpoint för att verifiera server och databas
app.get('/api/test', async (req, res) => {
    let dbStatus = 'unknown';
    try {
        // Testa en enkel MongoDB-operation
        await mongoose_1.default.connection.db.admin().ping();
        dbStatus = 'connected';
    }
    catch (err) {
        dbStatus = 'error: ' + (err instanceof Error ? err.message : String(err));
    }
    res.json({
        server: 'ok',
        mongo: dbStatus,
        time: new Date().toISOString()
    });
});
const http = require('http');
const socket_1 = require("./socket");
const PORT = Number(process.env.PORT) || 5000;
const MONGO_URI = process.env.MONGO_URI || '';
console.log('Trying to connect to MongoDB:', MONGO_URI);
mongoose_1.default.connect(MONGO_URI)
    .then(() => {
    console.log('MongoDB connection successful');
    const server = http.createServer(app);
    (0, socket_1.setupSocket)(server);
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running (Express + Socket.io) on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error('Database connection error:', err);
});
