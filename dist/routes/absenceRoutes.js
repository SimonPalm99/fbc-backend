"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Absence_1 = __importDefault(require("../models/Absence"));
const router = express_1.default.Router();
// GET /api/absences - hämta alla frånvaroanmälningar
router.get('/', async (req, res) => {
    try {
        const absences = await Absence_1.default.find().sort({ date: -1 });
        res.json(absences);
    }
    catch (err) {
        res.status(500).json({ error: 'Kunde inte hämta frånvaroanmälningar.' });
    }
});
// POST /api/absences - skapa ny frånvaroanmälan
router.post('/', async (req, res) => {
    try {
        const absence = new Absence_1.default(req.body);
        await absence.save();
        res.status(201).json(absence);
    }
    catch (err) {
        res.status(400).json({ error: 'Kunde inte spara frånvaroanmälan.' });
    }
});
exports.default = router;
