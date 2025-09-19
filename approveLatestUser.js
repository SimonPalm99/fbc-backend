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

async function approveLatestUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Hitta den senaste användaren med status 'pending'
    const latestUser = await User.findOne({ status: 'pending' }).sort({ _id: -1 });
    
    if (!latestUser) {
      console.log('Ingen pending användare hittades');
      return;
    }

    console.log('Hittat pending användare:', latestUser.name, latestUser.email);

    // Godkänn användaren
    latestUser.status = 'approved';
    await latestUser.save();

    console.log('✅ Användaren är nu godkänd!');
    console.log('Du kan nu logga in med:', latestUser.email);

  } catch (error) {
    console.error('Fel:', error);
  } finally {
    await mongoose.disconnect();
  }
}

approveLatestUser();