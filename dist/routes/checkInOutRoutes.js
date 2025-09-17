"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CheckInOut_1 = __importDefault(require("../models/CheckInOut"));
const router = (0, express_1.Router)();
// Spara check in/out
router.post('/', async (req, res) => {
    try {
        const check = new CheckInOut_1.default(req.body);
        await check.save();
        res.status(201).json(check);
    }
    catch (err) {
        res.status(400).json({ error: 'Kunde inte spara check in/out.' });
    }
});
// Hämta alla check in/out
router.get('/', async (req, res) => {
    try {
        const checks = await CheckInOut_1.default.find();
        res.json(checks);
    }
    catch (err) {
        res.status(500).json({ error: 'Kunde inte hämta check in/out.' });
    }
});
// Hämta check in/out för en aktivitet
router.get('/activity/:activityId', async (req, res) => {
    try {
        const checks = await CheckInOut_1.default.find({ activityId: req.params.activityId });
        res.json(checks);
    }
    catch (err) {
        res.status(500).json({ error: 'Kunde inte hämta check in/out för aktivitet.' });
    }
});
exports.default = router;
