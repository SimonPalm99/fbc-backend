"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Match_1 = __importDefault(require("../models/Match"));
const router = express_1.default.Router();
// Create match
router.post('/', async (req, res) => {
    try {
        const { date, teamA, teamB, scoreA, scoreB } = req.body;
        const match = new Match_1.default({ date, teamA, teamB, scoreA, scoreB });
        await match.save();
        res.status(201).json(match);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// Get all matches
router.get('/', async (req, res) => {
    const matches = await Match_1.default.find().populate('teamA teamB');
    res.json(matches);
});
exports.default = router;
