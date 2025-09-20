// importAllActivitiesFromJson.js
// Script för att importera ALLA aktiviteter från realActivities.json till MongoDB

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Uppdatera med din MongoDB Atlas connection string
const MONGODB_URI = 'mongodb+srv://Simon99FBC:Innebandy99@cluster0.cdi2miw.mongodb.net/fbcnykoping?retryWrites=true&w=majority&appName=Cluster0';

// Modell: Activity
const Activity = require('./src/models/Activity.js');

async function importActivities() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const filePath = path.join(__dirname, 'realActivities.json');
    const activities = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Radera alla befintliga aktiviteter först (om du vill börja om)
    await Activity.deleteMany({});
    console.log('Deleted all existing activities');

    // Importera alla aktiviteter
    const result = await Activity.insertMany(activities);
    console.log(`Imported ${result.length} activities.`);

    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error importing activities:', err);
    mongoose.disconnect();
    process.exit(1);
  }
}

importActivities();
