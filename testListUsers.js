const mongoose = require('mongoose');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  status: String,
  profileImageUrl: String
});

const User = mongoose.model('User', UserSchema);

async function testConnectionAndListUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB:', process.env.MONGO_URI);
    const users = await User.find();
    console.log('Antal användare:', users.length);
    users.forEach(u => console.log(u.name, u.email, u.status));
  } catch (err) {
    console.error('Fel vid anslutning eller hämtning:', err);
  } finally {
    await mongoose.disconnect();
  }
}

testConnectionAndListUsers();
