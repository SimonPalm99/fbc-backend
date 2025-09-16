import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Activity from './models/Activity';

dotenv.config();

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
  await mongoose.connect(MONGO_URI);
  await Activity.deleteMany({}); // Rensa gamla aktiviteter
  await Activity.insertMany(activities);
  console.log('FBC-aktiviteter importerade!');
  mongoose.disconnect();
}

importActivities();
