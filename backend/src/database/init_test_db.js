/**
 * @file Test Database Initialization
 * @description Creates test database for testing purposes
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const TEST_DB_PATH = path.join(__dirname, '../../test_database.db');

/**
 * Initialize test database schema
 */
function initTestDatabase() {
  const db = new sqlite3.Database(TEST_DB_PATH, (err) => {
    if (err) {
      console.error('Error opening test database:', err.message);
      return;
    }
    console.log('Connected to test SQLite database');
  });

  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        id_number TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating users table:', err.message);
      } else {
        console.log('Test users table created or already exists');
      }
    });

    // Verification codes table
    db.run(`
      CREATE TABLE IF NOT EXISTS verification_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        code TEXT NOT NULL,
        type TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        used INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating verification_codes table:', err.message);
      } else {
        console.log('Test verification codes table created or already exists');
      }
    });

    // Insert test users
    db.run(`
      INSERT OR IGNORE INTO users (username, password, email, phone, id_number)
      VALUES ('testuser', 'password123', 'test@example.com', '13800138000', '1234')
    `, (err) => {
      if (err) {
        console.error('Error inserting test user:', err.message);
      } else {
        console.log('Test user created or already exists');
      }
    });

    // Insert another test user for negative scenarios
    db.run(`
      INSERT OR IGNORE INTO users (username, password, email, phone, id_number)
      VALUES ('user2', 'pass456', 'user2@example.com', '13900139000', '5678')
    `, (err) => {
      if (err) {
        console.error('Error inserting test user 2:', err.message);
      } else {
        console.log('Test user 2 created or already exists');
      }
    });
  });

  db.close((err) => {
    if (err) {
      console.error('Error closing test database:', err.message);
    } else {
      console.log('Test database initialization complete');
    }
  });
}

// Run if called directly
if (require.main === module) {
  initTestDatabase();
}

module.exports = { initTestDatabase };

