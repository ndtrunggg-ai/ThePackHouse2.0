'use strict';

// Creates an admin or resets its password. The password is read from stdin so it stays out of the shell history.
// Usage: docker compose exec -it api node set-admin-password.js admin@example.com

const readline = require('node:readline');
const { setAdminPassword } = require('./auth');
const { db } = require('./db');

const email = process.argv[2];
if (!email) {
  console.error('Usage: node set-admin-password.js <email>');
  process.exit(1);
}

const prompt = readline.createInterface({ input: process.stdin, output: process.stderr, terminal: false });
process.stderr.write('New password: ');
prompt.once('line', async (password) => {
  prompt.close();
  try {
    await setAdminPassword(email, password.trim());
    console.log(`Password set for ${email}`);
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  }
  db.close();
});
