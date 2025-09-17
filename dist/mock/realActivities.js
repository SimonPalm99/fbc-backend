"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.realActivities = void 0;
// Synkad från frontend: src/data/realActivities.ts
const generateTrainings = () => {
    const startDate = new Date('2025-07-28');
    const endDate = new Date('2026-03-14');
    const daysOfWeek = [
        { day: 1, start: '20:30', end: '22:00', label: 'Måndag' },
        { day: 2, start: '19:30', end: '20:45', label: 'Tisdag' },
        { day: 4, start: '20:45', end: '22:00', label: 'Torsdag' }
    ];
    const trainings = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        for (const info of daysOfWeek) {
            if (d.getDay() === info.day) {
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                trainings.push({
                    id: `training-${yyyy}${mm}${dd}-${info.label}`,
                    title: `Träning ${info.label}`,
                    type: 'träning',
                    date: `${yyyy}-${mm}-${dd}`,
                    startTime: info.start,
                    location: 'Sporthallen',
                    description: `${info.label} (${yyyy}-${mm}-${dd}) • Samlingstid 30 min innan`,
                    createdBy: 'coach1',
                    participants: [],
                    comments: [],
                    tags: ['ordinarie'],
                    important: false
                });
            }
        }
    }
    return trainings;
};
const matches = [
    // ...alla matcher från frontend, samma som i src/data/realActivities.ts
    {
        id: "friendly-20250809",
        title: "FBC Nyköping vs Ledberg Innebandy",
        type: "match",
        date: "2025-08-09",
        startTime: "14:00",
        location: "Gnesta Sporthall",
        description: "Träningsmatch. Samling 12:30 (1,5 timme före matchstart).",
        createdBy: "coach1",
        participants: [],
        comments: [],
        tags: ["träningsmatch", "förberedelse"],
        important: false,
        color: "#4CAF50"
    },
    // ... (alla matcher, samma som i frontend)
];
exports.realActivities = [
    ...generateTrainings(),
    ...matches
];
