"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Message_1 = __importDefault(require("../models/Message"));
const router = express_1.default.Router();
// Send message
router.post('/', async (req, res) => {
    try {
        const message = new Message_1.default(req.body);
        await message.save();
        res.status(201).json(message);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// Get messages for user
router.get('/user/:userId', async (req, res) => {
    const messages = await Message_1.default.find({ receiver: req.params.userId });
    res.json(messages);
});
exports.default = router;
