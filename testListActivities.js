const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://Simon99FBC:Innebandy99@cluster0.cdi2miw.mongodb.net/fbcnykoping?retryWrites=true&w=majority&appName=Cluster0';

const ActivitySchema = new mongoose.Schema({}, { strict: false });
const Activity = mongoose.model('Activity', ActivitySchema, 'activities');

async function listActivities() {
  await mongoose.connect(MONGO_URI);
  const activities = await Activity.find();
  console.log('Antal aktiviteter:', activities.length);
  activities.forEach((a, i) => {
    console.log(`${i + 1}. ${a.title || '(ingen titel)'} - ${a.date || '(ingen datum)'} - ${a.type || '(ingen typ)'}`);
  });
  await mongoose.disconnect();
}

listActivities().catch(console.error);
