"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Profile_1 = __importDefault(require("../models/Profile"));
const router = express_1.default.Router();
// Get profile by user
router.get('/:userId', async (req, res) => {
    const profile = await Profile_1.default.findOne({ user: req.params.userId });
    res.json(profile);
});
// Update profile
router.put('/:userId', async (req, res) => {
    try {
        const updated = await Profile_1.default.findOneAndUpdate({ user: req.params.userId }, req.body, { new: true, upsert: true });
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.default = router;
