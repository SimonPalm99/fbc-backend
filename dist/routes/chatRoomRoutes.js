"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ChatRoom_1 = __importDefault(require("../models/ChatRoom"));
const router = express_1.default.Router();
// Skapa ny grupp
router.post('/', async (req, res) => {
    try {
        const chatRoom = new ChatRoom_1.default(req.body);
        await chatRoom.save();
        res.status(201).json(chatRoom);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// Hämta alla grupper där användaren är deltagare
router.get('/user/:userId', async (req, res) => {
    try {
        const rooms = await ChatRoom_1.default.find({ participants: req.params.userId });
        res.json(rooms);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// Ta bort grupp
router.delete('/:id', async (req, res) => {
    try {
        await ChatRoom_1.default.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.default = router;
