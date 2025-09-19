const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

mongoose.connect('mongodb+srv://Simon99FBC:Innebandy99@cluster0.cdi2miw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

async function addLeader() {
  const password = await bcrypt.hash('testledare123', 10);
  const user = new User({
    name: 'Ledare',
    email: 'ledare@fbcnykoping.se',
    password,
    role: 'coach',
    status: 'approved'
  });
  await user.save();
  console.log('Ledarkonto skapat!');
  mongoose.disconnect();
}

addLeader();
