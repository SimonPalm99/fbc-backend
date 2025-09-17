"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Team_1 = __importDefault(require("../models/Team"));
const router = express_1.default.Router();
// Create team
router.post('/', async (req, res) => {
    try {
        const { name, members } = req.body;
        const team = new Team_1.default({ name, members });
        await team.save();
        res.status(201).json(team);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// Get all teams
router.get('/', async (req, res) => {
    const teams = await Team_1.default.find().populate('members');
    res.json(teams);
});
exports.default = router;
