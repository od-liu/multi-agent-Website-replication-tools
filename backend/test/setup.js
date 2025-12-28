/**
 * Test Setup
 * Configure test environment to use test database
 */

import { beforeAll, afterAll, beforeEach } from 'vitest';
import { getDb, closeDb } from '../src/database/db.js';
import { initDatabase, clearDatabase, insertDemoData } from '../src/database/init_db.js';

// Set environment to test
process.env.NODE_ENV = 'test';

// Initialize test database before all tests
beforeAll(async () => {
  console.log('🧪 Setting up test database...');
  await initDatabase();
  await insertDemoData();
  console.log('✅ Test database ready');
});

// Clean up before each test
beforeEach(async () => {
  // Clear all data except demo users
  const db = getDb();
  await db.runAsync('DELETE FROM sessions');
  await db.runAsync('DELETE FROM verification_codes');
});

// Close database after all tests
afterAll(async () => {
  console.log('🧹 Cleaning up test database...');
  await closeDb();
  console.log('✅ Cleanup complete');
});

