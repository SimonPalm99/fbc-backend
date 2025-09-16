// Kör detta script i backend-mappen för att importera alla aktiviteter till MongoDB
import mongoose from 'mongoose';
import Activity from './models/Activity';
import { activities } from './realActivities';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fbc-backend';

async function importActivities() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Radera gamla aktiviteter (valfritt)
  await Activity.deleteMany({});
  console.log('Gamla aktiviteter borttagna');

  // Spara alla nya aktiviteter
    for (const activity of activities) {
      // Kopiera aktivitet och ta bort 'id'-fältet
      const { id, ...rest } = activity;
      await Activity.create(rest);
    }
  console.log('Alla aktiviteter importerade!');
  await mongoose.disconnect();
}

importActivities().catch(err => {
  console.error('Fel vid import:', err);
  process.exit(1);
});
