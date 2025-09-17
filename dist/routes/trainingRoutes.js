"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Training_1 = __importDefault(require("../models/Training"));
const router = express_1.default.Router();
// Create training
router.post('/', async (req, res) => {
    try {
        const { date, team, description } = req.body;
        const training = new Training_1.default({ date, team, description });
        await training.save();
        res.status(201).json(training);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// Get all trainings
router.get('/', async (req, res) => {
    const trainings = await Training_1.default.find().populate('team');
    res.json(trainings);
});
exports.default = router;
