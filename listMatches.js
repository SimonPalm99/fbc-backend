const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://Simon99FBC:Innebandy99@cluster0.cdi2miw.mongodb.net/fbcnykoping?retryWrites=true&w=majority&appName=Cluster0';

const ActivitySchema = new mongoose.Schema({}, { strict: false });
const Activity = mongoose.model('Activity', ActivitySchema, 'activities');

async function listMatches() {
  try {
    await mongoose.connect(MONGO_URI);
    const matches = await Activity.find({ type: 'match' });
    console.log('Antal matcher:', matches.length);
    matches.forEach(m => console.log(m.title, m.date));
    await mongoose.disconnect();
  } catch (err) {
    console.error('Fel vid anslutning:', err);
  }
}

listMatches();
