"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Attendance_1 = __importDefault(require("../models/Attendance"));
const router = express_1.default.Router();
// Mark attendance
router.post('/', async (req, res) => {
    try {
        const attendance = new Attendance_1.default(req.body);
        await attendance.save();
        res.status(201).json(attendance);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// Get attendance for user
router.get('/user/:userId', async (req, res) => {
    const attendance = await Attendance_1.default.find({ user: req.params.userId });
    res.json(attendance);
});
exports.default = router;
