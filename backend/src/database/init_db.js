/**
 * @file Database Initialization
 * @description Creates database tables for 12306 Login System
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../../database.db');

/**
 * Initialize database schema
 */
function initDatabase() {
  const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      return;
    }
    console.log('Connected to SQLite database');
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
        console.log('Users table created or already exists');
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
        console.log('Verification codes table created or already exists');
      }
    });

    // Insert sample user for testing
    db.run(`
      INSERT OR IGNORE INTO users (username, password, email, phone, id_number)
      VALUES ('testuser', 'password123', 'test@example.com', '13800138000', '1234')
    `, (err) => {
      if (err) {
        console.error('Error inserting sample user:', err.message);
      } else {
        console.log('Sample user created or already exists');
      }
    });
  });

  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database initialization complete');
    }
  });
}

// Run if called directly
if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase };

