/**
 * 测试数据库初始化脚本
 * 创建test_database.db用于测试环境
 */

import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEST_DB_PATH = path.join(__dirname, '../../test_database.db');

/**
 * 初始化测试数据库表结构和测试数据
 */
export function initializeTestDatabase() {
  const db = new sqlite3.Database(TEST_DB_PATH);

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
        console.log('✅ [TEST DB] Users table created');
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
        console.log('✅ [TEST DB] Verification_codes table created');
      }
    });

    // 清空旧数据
    db.run('DELETE FROM verification_codes', (err) => {
      if (err) console.error('Error clearing verification_codes:', err.message);
    });

    db.run('DELETE FROM users', (err) => {
      if (err) console.error('Error clearing users:', err.message);
    });

    // 插入测试用户数据
    db.run(`
      INSERT INTO users (username, password, email, phone, id_card_last4)
      VALUES 
        ('testuser', 'test123456', 'test@12306.cn', '13800138000', '1234'),
        ('zhangsan', 'password123', 'zhangsan@12306.cn', '13900139000', '5678'),
        ('user_no_match', 'wrongpass', 'wrong@12306.cn', '13700137000', '9999')
    `, (err) => {
      if (err) {
        console.error('Error inserting test users:', err.message);
      } else {
        console.log('✅ [TEST DB] Test users inserted');
        console.log('   - testuser / test123456 (证件号后4位: 1234)');
        console.log('   - zhangsan / password123 (证件号后4位: 5678)');
        console.log('   - user_no_match / wrongpass (证件号后4位: 9999)');
      }
    });
  });

  db.close((err) => {
    if (err) {
      console.error('Error closing test database:', err.message);
    } else {
      console.log('✅ [TEST DB] Test database initialization completed');
    }
  });
}

// 如果直接运行此文件，则初始化测试数据库
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeTestDatabase();
}

