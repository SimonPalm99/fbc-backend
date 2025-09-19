const mongoose = require('mongoose');
require('dotenv').config();

// Lokala MongoDB-anslutning
const LOCAL_URI = 'mongodb://localhost:27017/fbc-backend';
// Atlas-anslutning med fbcnykoping databas
const ATLAS_URI = 'mongodb+srv://Simon99FBC:Innebandy99@cluster0.cdi2miw.mongodb.net/fbcnykoping?retryWrites=true&w=majority&appName=Cluster0';

// Aktivitets-schema
const ActivitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ['training', 'match', 'meeting', 'event'], required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  maxParticipants: { type: Number },
  equipment: [String],
  notes: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['scheduled', 'ongoing', 'completed', 'cancelled'], default: 'scheduled' },
  isRecurring: { type: Boolean, default: false },
  recurringPattern: String,
  weather: String,
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  tags: [String],
  reminders: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reminderTime: Date,
    sent: { type: Boolean, default: false }
  }],
  feedback: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

async function migrateData() {
  try {
    console.log('🔄 Ansluter till lokal MongoDB...');
    const localConn = await mongoose.createConnection(LOCAL_URI);
    console.log('✅ Ansluten till lokal databas');

    console.log('🔄 Ansluter till Atlas MongoDB...');
    const atlasConn = await mongoose.createConnection(ATLAS_URI);
    console.log('✅ Ansluten till Atlas databas');

    // Skapa modeller för båda databaserna
    const LocalActivity = localConn.model('Activity', ActivitySchema);
    const AtlasActivity = atlasConn.model('Activity', ActivitySchema);

    // Hämta alla aktiviteter från lokal databas
    console.log('📋 Hämtar aktiviteter från lokal databas...');
    const localActivities = await LocalActivity.find();
    console.log(`📊 Hittade ${localActivities.length} aktiviteter lokalt`);

    if (localActivities.length === 0) {
      console.log('⚠️ Inga aktiviteter hittades i lokal databas');
      return;
    }

    // Lista aktiviteterna
    console.log('\n📋 Lokala aktiviteter:');
    localActivities.forEach((activity, index) => {
      console.log(`${index + 1}. ${activity.title} - ${activity.date} (${activity.type})`);
    });

    // Kolla om aktiviteter redan finns i Atlas
    const atlasActivities = await AtlasActivity.find();
    console.log(`\n📊 ${atlasActivities.length} aktiviteter finns redan i Atlas`);

    // Kopiera aktiviteter till Atlas (bara de som inte finns)
    let copiedCount = 0;
    for (const activity of localActivities) {
      // Kolla om aktiviteten redan finns i Atlas (baserat på titel och datum)
      const existingActivity = await AtlasActivity.findOne({
        title: activity.title,
        date: activity.date
      });

      if (!existingActivity) {
        // Skapa kopia utan _id så MongoDB skapar ny
        const activityData = activity.toObject();
        delete activityData._id;
        delete activityData.__v;

        await AtlasActivity.create(activityData);
        copiedCount++;
        console.log(`✅ Kopierade: ${activity.title}`);
      } else {
        console.log(`⏭️ Finns redan: ${activity.title}`);
      }
    }

    console.log(`\n🎉 Migrering klar! ${copiedCount} nya aktiviteter kopierade till Atlas`);

    // Visa alla aktiviteter i Atlas efter migrering
    const finalAtlasActivities = await AtlasActivity.find().sort({ date: 1 });
    console.log(`\n📋 Totalt ${finalAtlasActivities.length} aktiviteter i Atlas:`);
    finalAtlasActivities.forEach((activity, index) => {
      console.log(`${index + 1}. ${activity.title} - ${new Date(activity.date).toLocaleDateString('sv-SE')} (${activity.type})`);
    });

    await localConn.close();
    await atlasConn.close();
    console.log('\n✅ Alla anslutningar stängda');

  } catch (error) {
    console.error('❌ Fel vid migrering:', error);
  }
}

migrateData();