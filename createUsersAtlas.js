const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Direkt Atlas-anslutning med specifik databas
const ATLAS_URI = 'mongodb+srv://Simon99FBC:Innebandy99@cluster0.cdi2miw.mongodb.net/fbcnykoping?retryWrites=true&w=majority&appName=Cluster0';

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

async function createUsersInAtlas() {
  try {
    console.log('Ansluter till MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Ansluten till MongoDB Atlas');

    // Skapa admin-användare
    const adminEmail = 'admin@fbcnykoping.se';
    const adminPassword = 'admin123';
    
    // Kolla om admin redan finns
    let existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin-användare finns redan i Atlas');
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      const adminUser = new User({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        status: 'approved'
      });

      await adminUser.save();
      console.log('✅ Admin-användare skapad i Atlas!');
    }

    // Skapa även din personliga användare

    const userEmail = 'simon-palm@hotmail.com';
    const userPassword = 'Innebandy99'; // Sätt önskat lösenord
    let existingUser = await User.findOne({ email: userEmail });
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    if (existingUser) {
      existingUser.password = hashedPassword;
      await existingUser.save();
      console.log('✅ Simon Palm-lösenord uppdaterat till "Innebandy99"!');
    } else {
      const personalUser = new User({
        name: 'Simon Palm',
        email: userEmail,
        password: hashedPassword,
        role: 'admin',
        status: 'approved'
      });
      await personalUser.save();
      console.log('✅ Simon Palm-användare skapad i Atlas med lösenord "Innebandy99"!');
    }

    // Lista alla användare
    const allUsers = await User.find();
    console.log(`\n📋 Totalt ${allUsers.length} användare i Atlas:`);
    allUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - ${user.role} - ${user.status}`);
    });

    console.log('\n🎯 Inloggningsuppgifter:');
    console.log('Admin: admin@fbcnykoping.se / admin123');
    console.log('Simon: simon-palm@hotmail.com / test123');

  } catch (error) {
    console.error('❌ Fel:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Frånkopplad från Atlas');
  }
}

createUsersInAtlas();