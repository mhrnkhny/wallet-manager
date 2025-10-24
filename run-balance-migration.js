const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Read .env.local file
const envPath = path.join(__dirname, '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

async function runMigration() {
  const connection = await mysql.createConnection({
    host: envVars.DB_HOST || '127.0.0.1',
    port: envVars.DB_PORT || 8080,
    user: envVars.DB_USER || 'root',
    password: envVars.DB_PASSWORD,
    database: envVars.DB_NAME || 'bank_transactions',
  });

  try {
    console.log('🔄 Running migration: Add balance field to bank_cards...');

    // Add balance column
    await connection.execute(`
      ALTER TABLE bank_cards
      ADD COLUMN balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00 AFTER sheba_number
    `);

    console.log('✅ Balance column added successfully');

    // Show table structure
    const [rows] = await connection.execute('DESCRIBE bank_cards');
    console.log('\n📋 Updated table structure:');
    console.table(rows);

    console.log('\n✨ Migration completed successfully!');
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('ℹ️  Balance column already exists. Skipping migration.');
    } else {
      console.error('❌ Migration failed:', error.message);
      throw error;
    }
  } finally {
    await connection.end();
  }
}

runMigration().catch(console.error);
