"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const checkQuestionSchema = new mongoose_1.Schema({
    type: { type: String, enum: ['in', 'out'], required: true },
    text: { type: String, required: true },
    options: { type: [String], required: true }
});
exports.default = (0, mongoose_1.model)('CheckQuestion', checkQuestionSchema);
