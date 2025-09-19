const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Atlas connection
const ATLAS_URI = 'mongodb+srv://Simon99FBC:Innebandy99@cluster0.cdi2miw.mongodb.net/fbcnykoping?retryWrites=true&w=majority&appName=Cluster0';

// Activity schema (enkel version, kan utökas vid behov)
const ActivitySchema = new mongoose.Schema({
  id: String,
  title: String,
  type: String,
  date: String,
  startTime: String,
  endTime: String,
  location: String,
  description: String,
  createdBy: String,
  participants: Array,
  comments: Array,
  tags: Array,
  important: Boolean,
  color: String
});

async function uploadActivities() {
  try {
    // Läs in alla aktiviteter från realActivities.json
    const activitiesPath = path.join(__dirname, 'realActivities.json');
    const activities = JSON.parse(fs.readFileSync(activitiesPath, 'utf8'));

    // Anslut till Atlas
    const conn = await mongoose.createConnection(ATLAS_URI);
    const Activity = conn.model('Activity', ActivitySchema);

    // Radera alla gamla aktiviteter (om du vill börja om)
    await Activity.deleteMany({});

    // Ladda upp alla aktiviteter i batch
    await Activity.insertMany(activities);
    console.log(`✅ Laddade upp ${activities.length} aktiviteter till Atlas!`);

    await conn.close();
    console.log('✅ Klar och anslutning stängd!');
  } catch (err) {
    console.error('❌ Fel vid uppladdning:', err);
  }
}

uploadActivities();
