/**
 * 数据库初始化脚本
 * 创建users和verification_codes表
 */

import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../../database.db');

/**
 * 初始化数据库表结构
 */
export function initializeDatabase() {
  const db = new sqlite3.Database(DB_PATH);

  db.serialize(() => {
    // 创建users表
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        id_card_last4 TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating users table:', err.message);
      } else {
        console.log('✅ Users table created or already exists');
      }
    });

    // 创建verification_codes表
    db.run(`
      CREATE TABLE IF NOT EXISTS verification_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        code TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_used INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating verification_codes table:', err.message);
      } else {
        console.log('✅ Verification_codes table created or already exists');
      }
    });

    // 插入测试用户数据（用于开发测试）
    db.run(`
      INSERT OR IGNORE INTO users (username, password, email, phone, id_card_last4)
      VALUES 
        ('testuser', 'password123', 'test@example.com', '13800138000', '1234'),
        ('admin', 'admin123456', 'admin@12306.com', '13900139000', '5678')
    `, (err) => {
      if (err) {
        console.error('Error inserting test data:', err.message);
      } else {
        console.log('✅ Test users inserted or already exist');
      }
    });
  });

  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('✅ Database initialization completed');
    }
  });
}

// 如果直接运行此文件，则初始化数据库
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase();
}
