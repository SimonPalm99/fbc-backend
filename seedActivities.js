const mongoose = require('mongoose');
require('dotenv').config();

// Activity schema (samma som i din Activity.ts)
const ActivitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String },
  endTime: { type: String },
  location: { type: String },
  description: { type: String },
  type: { type: String, required: true },
  important: { type: Boolean, default: false },
  participants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String },
    absenceReason: { type: String }
  }],
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String },
    timestamp: { type: String }
  }]
});

const Activity = mongoose.model('Activity', ActivitySchema);

async function seedActivities() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Ansluten till MongoDB Atlas');

    // Kolla befintliga aktiviteter
    const existingActivities = await Activity.find();
    console.log(`\n📋 Befintliga aktiviteter: ${existingActivities.length}`);
    
    if (existingActivities.length > 0) {
      console.log('Befintliga aktiviteter:');
      existingActivities.forEach((activity, index) => {
        console.log(`${index + 1}. ${activity.title} - ${activity.date} (${activity.type})`);
      });
    }

    // Skapa nya aktiviteter om det inte finns några
    if (existingActivities.length === 0) {
      console.log('\n🌱 Skapar testaktiviteter...');
      
      const testActivities = [
        {
          title: 'Träning - Grundläggande teknik',
          date: '2025-09-22',
          startTime: '18:00',
          endTime: '19:30',
          location: 'Sporthallen Nyköping',
          description: 'Fokus på grundläggande teknik och passes. Vi tränar stick-handling, skott och spelförståelse.',
          type: 'träning',
          important: false,
          participants: [],
          comments: []
        },
        {
          title: 'Match mot Katrineholm IBK',
          date: '2025-09-24',
          startTime: '19:00',
          endTime: '21:00',
          location: 'Katrineholm Sporthall',
          description: 'Viktigt seriespel mot Katrineholm. Samling 18:30.',
          type: 'match',
          important: true,
          participants: [],
          comments: []
        },
        {
          title: 'Konditionsträning',
          date: '2025-09-26',
          startTime: '17:30',
          endTime: '18:30',
          location: 'Sporthallen Nyköping',
          description: 'Intensiv konditionsträning. Ta med vattenflaska!',
          type: 'träning',
          important: false,
          participants: [],
          comments: []
        },
        {
          title: 'Lagets Månadsmöte',
          date: '2025-09-28',
          startTime: '19:00',
          endTime: '20:00',
          location: 'Klubblokal FBC Nyköping',
          description: 'Månadsvis lagmöte för att diskutera kommande matcher och aktiviteter.',
          type: 'annat',
          important: true,
          participants: [],
          comments: []
        },
        {
          title: 'Cup - Strängnäs Open',
          date: '2025-09-30',
          startTime: '09:00',
          endTime: '17:00',
          location: 'Strängnäs Sporthall',
          description: 'Heldag cup med flera matcher. Lunch ingår. Samling 08:30.',
          type: 'cup',
          important: true,
          participants: [],
          comments: []
        }
      ];

      for (const activityData of testActivities) {
        const activity = new Activity(activityData);
        await activity.save();
        console.log(`✅ Skapad: ${activity.title}`);
      }

      console.log(`\n🎉 ${testActivities.length} aktiviteter skapade!`);
    } else {
      console.log('\n✨ Aktiviteter finns redan - hoppar över skapande');
    }

  } catch (error) {
    console.error('❌ Fel:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Frånkopplad från Atlas');
  }
}

seedActivities();