"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Activity_1 = __importDefault(require("../models/Activity"));
const router = express_1.default.Router();
// Get all activities
// GET /api/activities
router.get('/', async (req, res) => {
    try {
        const activities = await Activity_1.default.find();
        res.json(activities);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Get activity by id
router.get('/:id', async (req, res) => {
    try {
        const activity = await Activity_1.default.findById(req.params.id).populate('participants.userId').populate('comments.userId');
        if (!activity) {
            return res.status(404).json({ error: 'Aktivitet hittades inte' });
        }
        res.json(activity);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Create activity
router.post('/', async (req, res) => {
    try {
        const activity = new Activity_1.default(req.body);
        await activity.save();
        res.status(201).json(activity);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// Update activity
const auth_1 = require("../middleware/auth");
router.put('/:id', auth_1.authenticateToken, auth_1.requireLeaderOrAdmin, async (req, res) => {
    try {
        const updated = await Activity_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// Delete activity
router.delete('/:id', auth_1.authenticateToken, auth_1.requireLeaderOrAdmin, async (req, res) => {
    try {
        await Activity_1.default.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.default = router;
