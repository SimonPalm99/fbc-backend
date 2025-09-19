"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
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
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3000',
        'https://fbc-nykoping-lagapp.vercel.app',
        'https://fbc-nykoping-lagapp-h9v2c2civ-simon-palms-projects.vercel.app',
        'https://fbc-nykoping-lagapp-co18intd7-simon-palms-projects.vercel.app'
    ],
    credentials: true
}));
app.use(express_1.default.json());
app.use('/api/users', userRoutes_1.default);
app.use('/api/teams', teamRoutes_1.default);
app.use('/api/matches', matchRoutes_1.default);
app.use('/api/trainings', trainingRoutes_1.default);
app.use('/api/profiles', profileRoutes_1.default);
app.use('/api/fines', fineRoutes_1.default);
app.use('/api/attendance', attendanceRoutes_1.default);
app.use('/api/messages', messageRoutes_1.default);
app.use('/api/forum', forumRoutes_1.default);
app.use('/api/statistics', statisticRoutes_1.default);
app.use('/api/activities', activityRoutes_1.default);
app.use('/api/cash', cashRoutes_1.default);
app.use('/api/rules', rulesRoutes_1.default);
app.use('/api/absences', absenceRoutes_1.default);
app.use('/api/checks', checkInOutRoutes_1.default);
app.use('/api/check-questions', checkQuestionRoutes_1.default);
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';
mongoose_1.default.connect(MONGO_URI)
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error('Database connection error:', err);
});
