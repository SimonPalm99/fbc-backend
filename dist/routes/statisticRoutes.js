"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Statistic_1 = __importDefault(require("../models/Statistic"));
const router = express_1.default.Router();
// Get statistics for user
router.get('/user/:userId', async (req, res) => {
    const stats = await Statistic_1.default.findOne({ user: req.params.userId });
    res.json(stats);
});
// Update statistics
router.put('/user/:userId', async (req, res) => {
    try {
        const updated = await Statistic_1.default.findOneAndUpdate({ user: req.params.userId }, req.body, { new: true, upsert: true });
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.default = router;
