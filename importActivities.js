// Kör: node importActivities.js
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const { Schema } = mongoose;
const ActivitySchema = new Schema({
  id: String,
  title: String,
  date: String,
  startTime: String,
  endTime: String,
  location: String,
  description: String,
  type: String,
  important: Boolean,
  participants: Array,
  comments: Array,
  tags: Array,
  createdBy: String,
  color: String
});
const Activity = mongoose.model('Activity', ActivitySchema);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fbc-backend';
const activities = JSON.parse(fs.readFileSync(path.join(__dirname, 'activities.json'), 'utf8'));

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');
  // Rensa hela activities-collectionen
  await Activity.deleteMany({});
  // Lägg in alla nya aktiviteter
  await Activity.insertMany(activities);
  console.log(`${activities.length} aktiviteter inlagda!`);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Fel vid import:', err);
  process.exit(1);
});
