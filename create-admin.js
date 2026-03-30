const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Check existing admins
    const res = await client.query('SELECT id, email FROM "Admin"');
    console.log('Current Admins:', res.rows);

    // Create or Update admin
    const email = 'admin@example.com';
    const password = 'admin';
    const hashedPassword = await bcrypt.hash(password, 10);

    const checkRes = await client.query('SELECT * FROM "Admin" WHERE email = $1', [email]);
    
    if (checkRes.rows.length > 0) {
      console.log(`Admin ${email} already exists. Updating password to "admin"...`);
      await client.query('UPDATE "Admin" SET password = $2 WHERE email = $1', [email, hashedPassword]);
      console.log('Password updated.');
    } else {
      console.log(`Creating new admin: ${email} with password "admin"...`);
      await client.query('INSERT INTO "Admin" (email, password) VALUES ($1, $2)', [email, hashedPassword]);
      console.log('Admin created.');
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

main();
