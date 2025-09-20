// Testscript för att hämta och visa alla aktiviteter direkt från databasen
const mongoose = require('mongoose');
const Activity = require('./src/models/Activity');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/fbc';

async function main() {
  await mongoose.connect(MONGO_URL);
  const activities = await Activity.find();
  console.log('Antal aktiviteter:', activities.length);
  for (const a of activities) {
    console.log(a.title, a.date, a.type);
  }
  await mongoose.disconnect();
}

main().catch(console.error);
