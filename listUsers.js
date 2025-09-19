const mongoose = require('mongoose');
require('dotenv').config();

// User schema (samma som i din User.ts)
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['player', 'coach', 'admin'], default: 'player' },
  status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
  profileImageUrl: { type: String, default: '' }
});

const User = mongoose.model('User', UserSchema);

async function listAllUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const users = await User.find().sort({ _id: -1 });
    
    console.log(`\nHittade ${users.length} användare:\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   Status: ${user.status}, Roll: ${user.role}`);
      console.log(`   ID: ${user._id}`);
      console.log('');
    });

  } catch (error) {
    console.error('Fel:', error);
  } finally {
    await mongoose.disconnect();
  }
}

listAllUsers();