/**
 * Database Connection
 * SQLite3 database connection setup with test/production environment support
 */

import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Choose database based on environment
const isTest = process.env.NODE_ENV === 'test';
const dbFilename = isTest ? 'test_database.db' : 'database.db';
const dbPath = path.resolve(__dirname, '../../', dbFilename);

let db = null;

/**
 * Get database connection (singleton pattern)
 * Returns a sqlite3 database with promisified methods
 */
export function getDb() {
  if (!db) {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        throw err;
      } else {
        console.log(`Connected to SQLite database: ${dbFilename}`);
        // Enable foreign key constraints
        db.run('PRAGMA foreign_keys = ON');
      }
    });
    
    // Promisify common methods
    db.runAsync = promisify(db.run.bind(db));
    db.getAsync = promisify(db.get.bind(db));
    db.allAsync = promisify(db.all.bind(db));
    db.execAsync = promisify(db.exec.bind(db));
  }
  return db;
}

/**
 * Close database connection
 */
export function closeDb() {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
          reject(err);
        } else {
          console.log('Database connection closed');
          db = null;
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

// Default export for backward compatibility
export default getDb();

