/**
 * @file Database Connection
 * @description SQLite database connection singleton
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Use test database in test mode
const DB_PATH = process.env.TEST_MODE === 'true' && process.env.TEST_DB_PATH
  ? process.env.TEST_DB_PATH
  : path.join(__dirname, '../../database.db');

let db = null;

/**
 * Get database connection
 * @returns {sqlite3.Database} Database instance
 */
function getDatabase() {
  if (!db) {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        throw err;
      }
    });
  }
  return db;
}

/**
 * Close database connection
 */
function closeDatabase() {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      }
      db = null;
    });
  }
}

/**
 * Reset database connection (for testing)
 */
function resetDatabase() {
  db = null;
}

module.exports = {
  getDatabase,
  closeDatabase,
  resetDatabase
};

