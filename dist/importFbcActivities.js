"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Activity_1 = __importDefault(require("./models/Activity"));
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI || '';
const activities = [
    {
        title: 'FBC Nyköping Träning',
        date: '2025-09-15',
        startTime: '18:00',
        endTime: '19:30',
        location: 'Rosvalla A-hall',
        description: 'Träning med fokus på passningsspel och avslut',
        type: 'träning',
        important: true,
        participants: [],
        comments: []
    },
    {
        title: 'FBC Nyköping Match',
        date: '2025-09-20',
        startTime: '15:00',
        endTime: '16:30',
        location: 'Rosvalla B-hall',
        description: 'Seriematch mot Trosa Edanö IBK',
        type: 'match',
        important: true,
        participants: [],
        comments: []
    },
    {
        title: 'FBC Nyköping Lagfest',
        date: '2025-09-25',
        startTime: '19:00',
        location: 'Klubblokalen',
        description: 'Gemensam lagfest med middag och aktiviteter',
        type: 'lagfest',
        important: false,
        participants: [],
        comments: []
    }
];
async function importActivities() {
    await mongoose_1.default.connect(MONGO_URI);
    await Activity_1.default.deleteMany({}); // Rensa gamla aktiviteter
    await Activity_1.default.insertMany(activities);
    console.log('FBC-aktiviteter importerade!');
    mongoose_1.default.disconnect();
}
importActivities();
