"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Fine_1 = __importDefault(require("../models/Fine"));
const router = express_1.default.Router();
// Create fine
router.post('/', async (req, res) => {
    try {
        const fine = new Fine_1.default(req.body);
        await fine.save();
        res.status(201).json(fine);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// Get fines for user
router.get('/user/:userId', async (req, res) => {
    const fines = await Fine_1.default.find({ user: req.params.userId });
    res.json(fines);
});
exports.default = router;
