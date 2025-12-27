/**
 * 数据库连接管理
 * 使用SQLite3数据库
 */

import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 数据库文件路径（支持环境变量，用于测试）
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../database.db');

/**
 * 获取数据库连接
 * @returns {sqlite3.Database} 数据库连接实例
 */
export function getDatabase() {
  const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Database connection error:', err.message);
      throw err;
    }
  });
  return db;
}

/**
 * 执行SQL查询（返回Promise）
 * @param {string} sql - SQL语句
 * @param {Array} params - 参数数组
 * @returns {Promise<any>} 查询结果
 */
export function queryDatabase(sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    db.all(sql, params, (err, rows) => {
      db.close();
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

/**
 * 执行SQL更新/插入（返回Promise）
 * @param {string} sql - SQL语句
 * @param {Array} params - 参数数组
 * @returns {Promise<object>} 执行结果
 */
export function runDatabase(sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    db.run(sql, params, function (err) {
      db.close();
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
}

/**
 * 获取单条记录
 * @param {string} sql - SQL语句
 * @param {Array} params - 参数数组
 * @returns {Promise<any>} 查询结果
 */
export function getOneRecord(sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    db.get(sql, params, (err, row) => {
      db.close();
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}
