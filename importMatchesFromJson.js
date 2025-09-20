const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://Simon99FBC:Innebandy99@cluster0.cdi2miw.mongodb.net/fbcnykoping?retryWrites=true&w=majority&appName=Cluster0';

const ActivitySchema = new mongoose.Schema({}, { strict: false });
const Activity = mongoose.model('Activity', ActivitySchema, 'activities');

const matches = JSON.parse(fs.readFileSync('matchesData.json', 'utf8'));

async function importMatches() {
  try {
    await mongoose.connect(MONGO_URI);
    for (const match of matches) {
      // Endast fält som finns i Activity-schema
      const activityData = {
        title: match.title,
        date: match.date,
        startTime: match.startTime,
        endTime: match.endTime,
        location: match.location,
        description: match.description,
        type: match.type,
        important: match.important || false,
        participants: Array.isArray(match.participants) ? match.participants : [],
        comments: Array.isArray(match.comments) ? match.comments : []
      };
      // Kontrollera om matchen redan finns (baserat på titel, datum och typ)
      const exists = await Activity.findOne({ title: match.title, date: match.date, type: match.type });
      if (!exists) {
        await Activity.create(activityData);
        console.log('Importerad:', match.title, match.date);
      } else {
        console.log('Redan i databasen:', match.title, match.date);
      }
    }
    await mongoose.disconnect();
    console.log('Import klar!');
  } catch (err) {
    console.error('Fel vid import:', err);
  }
}

importMatches();
