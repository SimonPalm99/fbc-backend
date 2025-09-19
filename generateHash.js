const bcrypt = require('bcryptjs');

bcrypt.hash('testledare123', 10).then(hash => {
  console.log('Hash:', hash);
});
