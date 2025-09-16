// Kör detta script i backend-mappen för att importera alla aktiviteter till MongoDB
import mongoose from 'mongoose';
import Activity from './models/Activity';
import { realActivities as activities } from './mock/realActivities';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fbc-backend';

async function importActivities() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Radera gamla aktiviteter (valfritt)
  await Activity.deleteMany({});
  console.log('Gamla aktiviteter borttagna');

  // Spara alla nya aktiviteter
  let importedCount = 0;
  if (!activities || activities.length === 0) {
    console.warn('Inga aktiviteter att importera! Kontrollera mock/realActivities.');
  } else {
    for (const activity of activities) {
      if (typeof activity === 'object' && activity !== null) {
        const { id, ...rest } = activity;
        await Activity.create(rest);
        importedCount++;
      } else {
        console.warn('Hoppar över ogiltig aktivitet:', activity);
      }
    }
    console.log(`${importedCount} aktiviteter importerade!`);
  }
  await mongoose.disconnect();
}

importActivities().catch(err => {
  console.error('Fel vid import:', err);
  process.exit(1);
});