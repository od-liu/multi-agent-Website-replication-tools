/**
 * Insert Demo Data Script
 * 插入演示用户到主数据库
 */

import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../../database.db');
const db = new sqlite3.Database(dbPath);

// 加密密码
const password = bcrypt.hashSync('password123', 10);

db.serialize(() => {
  // 检查是否已存在演示用户
  db.get('SELECT id FROM users WHERE username = ?', ['testuser'], (err, row) => {
    if (err) {
      console.error('查询失败:', err);
      db.close();
      return;
    }

    if (row) {
      console.log('✅ 演示用户已存在，无需重复创建');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📝 演示账户信息：');
      console.log('   用户名: testuser');
      console.log('   密码: password123');
      console.log('   邮箱: test@12306.cn');
      console.log('   手机号: 13800138000');
      console.log('   证件号后4位: 1234');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      db.close();
    } else {
      // 插入演示用户
      db.run(`
        INSERT INTO users (username, password_hash, email, phone, id_card_last4)
        VALUES (?, ?, ?, ?, ?)
      `, ['testuser', password, 'test@12306.cn', '13800138000', '1234'], function(err) {
        if (err) {
          console.error('插入用户失败:', err);
        } else {
          console.log('✅ 演示用户创建成功！');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('📝 演示账户信息：');
          console.log('   用户名: testuser');
          console.log('   密码: password123');
          console.log('   邮箱: test@12306.cn');
          console.log('   手机号: 13800138000');
          console.log('   证件号后4位: 1234');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        }
        db.close();
      });
    }
  });
});

