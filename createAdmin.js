const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// User schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['player', 'coach', 'admin'], default: 'player' },
  status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
  profileImageUrl: { type: String, default: '' }
});

const User = mongoose.model('User', UserSchema);

async function createAdminUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Skapa admin-användare
    const adminEmail = 'admin@fbcnykoping.se';
    const adminPassword = 'admin123';
    
    // Kolla om admin redan finns
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin-användare finns redan');
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const adminUser = new User({
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      status: 'approved'
    });

    await adminUser.save();
    
    console.log('✅ Admin-användare skapad!');
    console.log('E-post:', adminEmail);
    console.log('Lösenord:', adminPassword);
    console.log('Roll: admin');
    console.log('Status: approved');

  } catch (error) {
    console.error('Fel:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdminUser();