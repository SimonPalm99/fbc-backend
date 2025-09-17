"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
let fineRules = [];
router.get('/', (req, res) => {
    res.json({ success: true, data: fineRules });
});
router.post('/', (req, res) => {
    const rule = req.body;
    rule.id = Date.now().toString();
    rule.createdAt = new Date().toISOString();
    fineRules.push(rule);
    res.json({ success: true, data: rule });
});
exports.default = router;
