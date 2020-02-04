const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';

var hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);

console.log(`hashed password is ${hash}`)
