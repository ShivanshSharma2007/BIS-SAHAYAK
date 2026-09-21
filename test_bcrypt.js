const bcrypt = require('bcryptjs');
bcrypt.hash('Goku@123', 10).then(hash => console.log(hash));
