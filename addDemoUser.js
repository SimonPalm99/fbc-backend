// Script för att lägga till demo-användare "Simon demo" i databasen
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fbcnykoping';

async function addDemoUser() {
  await mongoose.connect(MONGO_URI);
  const email = 'simon@demo.se';
  const password = await bcrypt.hash('demo123', 10);
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Demo-användaren finns redan.');
    process.exit(0);
  }
  const user = new User({
    name: 'Simon demo',
    email,
    password,
    role: 'leader',
    status: 'approved',
    profileImageUrl: ''
  });
  await user.save();
  console.log('Demo-användare "Simon demo" skapad!');
  process.exit(0);
}

addDemoUser();
