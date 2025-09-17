"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Kör detta script i backend-mappen för att importera alla aktiviteter till MongoDB
const mongoose_1 = __importDefault(require("mongoose"));
const Activity_1 = __importDefault(require("./models/Activity"));
const realActivities_1 = require("./mock/realActivities");
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fbc-backend';
async function importActivities() {
    await mongoose_1.default.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    // Radera gamla aktiviteter (valfritt)
    await Activity_1.default.deleteMany({});
    console.log('Gamla aktiviteter borttagna');
    // Spara alla nya aktiviteter
    let importedCount = 0;
    if (!realActivities_1.realActivities || realActivities_1.realActivities.length === 0) {
        console.warn('Inga aktiviteter att importera! Kontrollera mock/realActivities.');
    }
    else {
        for (const activity of realActivities_1.realActivities) {
            if (typeof activity === 'object' && activity !== null) {
                const { id, ...rest } = activity;
                await Activity_1.default.create(rest);
                importedCount++;
            }
            else {
                console.warn('Hoppar över ogiltig aktivitet:', activity);
            }
        }
        console.log(`${importedCount} aktiviteter importerade!`);
    }
    await mongoose_1.default.disconnect();
}
importActivities().catch(err => {
    console.error('Fel vid import:', err);
    process.exit(1);
});
