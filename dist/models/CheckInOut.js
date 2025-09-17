"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const checkInOutSchema = new mongoose_1.Schema({
    activityId: { type: String, required: true },
    activityTitle: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    type: { type: String, enum: ['in', 'out'], required: true },
    bodyFeeling: { type: Number, min: 1, max: 4, required: true },
    mentalFeeling: { type: Number, min: 1, max: 4, required: true },
    date: { type: String, required: true }
});
exports.default = (0, mongoose_1.model)('CheckInOut', checkInOutSchema);
