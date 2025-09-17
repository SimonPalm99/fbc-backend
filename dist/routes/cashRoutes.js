"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
let cashEntries = [];
router.get('/', (req, res) => {
    res.json({ success: true, data: cashEntries });
});
router.post('/', (req, res) => {
    const entry = req.body;
    entry.id = Date.now().toString();
    cashEntries.push(entry);
    res.json({ success: true, data: entry });
});
exports.default = router;
