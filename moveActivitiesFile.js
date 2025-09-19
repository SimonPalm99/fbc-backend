const fs = require('fs');
const path = require('path');

// Source: frontend
const source = path.join('..', 'fbc-nykoping-lagapp', 'realActivities.json');
// Destination: backend
const dest = path.join(__dirname, 'realActivities.json');

if (!fs.existsSync(source)) {
  console.error('❌ realActivities.json saknas i frontend-mappen. Exportera först!');
  process.exit(1);
}

fs.copyFileSync(source, dest);
console.log('✅ Filen realActivities.json har flyttats till backend-mappen!');
