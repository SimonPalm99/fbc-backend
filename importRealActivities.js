// Script för att importera aktiviteter till databasen
// Kör: node importRealActivities.js

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Använd samma MongoDB-URL som appen (från .env)
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URI;

// Modell för aktivitet
const Activity = require('./src/models/Activity');

async function main() {
  await mongoose.connect(MONGO_URL);
  const filePath = path.join(__dirname, 'realActivities.json');
  const activities = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  for (const activity of activities) {
    // Spara varje aktivitet
    await Activity.updateOne(
      { id: activity.id },
      activity,
      { upsert: true }
    );
    console.log(`Importerad: ${activity.title} (${activity.type})`);
  }
  console.log('Import klar!');
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Fel vid import:', err);
  process.exit(1);
});
