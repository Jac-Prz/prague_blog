#!/usr/bin/env node

/**
 * Helper script to generate a bcrypt hash for your admin password
 * 
 * Usage:
 *   node scripts/hash-password.js yourPasswordHere
 * 
 * Then copy the output and set it as ADMIN_PASSWORD in .env.local
 */

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('\n❌ Error: No password provided');
  console.log('\nUsage:');
  console.log('  node scripts/hash-password.js yourPasswordHere\n');
  process.exit(1);
}

// Generate hash with 10 rounds (secure enough for most applications)
const hash = bcrypt.hashSync(password, 10);

console.log('\n✅ Password hashed successfully!\n');
console.log('Copy this hash and set it as ADMIN_PASSWORD in your .env.local:\n');
console.log(`ADMIN_PASSWORD="${hash}"`);
console.log('\n💡 Tip: Keep your plain text password in a secure password manager!\n');
