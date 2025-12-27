/**
 * @file Database Operations
 * @description Business logic functions for 12306 Login System
 */

const { getDatabase } = require('./db');

/**
 * @function FUNC-AUTHENTICATE-USER
 * @signature authenticateUser(username, password)
 * @input {string} username - 用户名/邮箱/手机号
 * @input {string} password - 密码
 * @output {Object} { success: boolean, message: string, userId?: number }
 * @db_ops SELECT FROM users WHERE username = ? OR email = ? OR phone = ?
 * 
 * @scenarios_covered:
 *   ✅ SCENARIO-004: 用户名未注册
 *   ✅ SCENARIO-005: 密码错误
 *   ✅ SCENARIO-006: 登录成功
 */
async function authenticateUser(username, password) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    
    const query = `
      SELECT id, username, password, email, phone, id_number
      FROM users
      WHERE username = ? OR email = ? OR phone = ?
      LIMIT 1
    `;
    
    db.get(query, [username, username, username], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (!row) {
        // SCENARIO-004: 用户名未注册
        resolve({
          success: false,
          message: '用户名或密码错误！'
        });
        return;
      }
      
      if (row.password !== password) {
        // SCENARIO-005: 密码错误
        resolve({
          success: false,
          message: '用户名或密码错误！'
        });
        return;
      }
      
      // SCENARIO-006: 登录成功
      resolve({
        success: true,
        message: '登录成功',
        userId: row.id
      });
    });
  });
}

/**
 * @function FUNC-SEND-VERIFICATION-CODE
 * @signature sendVerificationCode(username, idNumber)
 * @input {string} username - 用户名
 * @input {string} idNumber - 证件号后4位
 * @output {Object} { success: boolean, message: string, code?: string }
 * @db_ops SELECT FROM users; INSERT INTO verification_codes
 * 
 * @scenarios_covered:
 *   ✅ SCENARIO-001: 获取验证码-证件号错误
 *   ✅ SCENARIO-002: 获取验证码-成功
 *   ✅ SCENARIO-003: 获取验证码-频率限制
 */
async function sendVerificationCode(username, idNumber) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    
    // 1. 验证用户和证件号
    const userQuery = `
      SELECT id, id_number
      FROM users
      WHERE username = ? OR email = ? OR phone = ?
      LIMIT 1
    `;
    
    db.get(userQuery, [username, username, username], (err, user) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (!user || user.id_number !== idNumber) {
        // SCENARIO-001: 证件号错误
        resolve({
          success: false,
          message: '请输入正确的用户信息！'
        });
        return;
      }
      
      // 2. 检查频率限制（1分钟内是否已发送）
      const frequencyQuery = `
        SELECT id, created_at
        FROM verification_codes
        WHERE user_id = ? AND type = 'sms'
        ORDER BY created_at DESC
        LIMIT 1
      `;
      
      db.get(frequencyQuery, [user.id], (err, lastCode) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (lastCode) {
          // SQLite CURRENT_TIMESTAMP returns UTC time string, need to add 'Z' for correct parsing
          const lastTime = new Date(lastCode.created_at + ' UTC').getTime();
          const now = Date.now();
          const diffSeconds = (now - lastTime) / 1000;
          
          if (diffSeconds < 60) {
            // SCENARIO-003: 频率限制
            resolve({
              success: false,
              message: '请求验证码过于频繁，请稍后再试！'
            });
            return;
          }
        }
        
        // 3. 生成6位验证码
        const code = String(Math.floor(100000 + Math.random() * 900000));
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5分钟后过期
        
        // 4. 保存验证码到数据库
        const insertQuery = `
          INSERT INTO verification_codes (user_id, code, type, expires_at)
          VALUES (?, ?, 'sms', ?)
        `;
        
        db.run(insertQuery, [user.id, code, expiresAt], (err) => {
          if (err) {
            reject(err);
            return;
          }
          
          // SCENARIO-002: 成功
          console.log(`[SMS] 验证码已生成: ${code} (用户: ${username})`);
          resolve({
            success: true,
            message: '验证码已发送',
            code // 开发环境返回验证码
          });
        });
      });
    });
  });
}

/**
 * @function FUNC-VERIFY-SMS-CODE
 * @signature verifySmsCode(username, idNumber, code)
 * @input {string} username - 用户名
 * @input {string} idNumber - 证件号后4位
 * @input {string} code - 验证码
 * @output {Object} { success: boolean, message: string, token?: string }
 * @db_ops SELECT FROM verification_codes; UPDATE users
 * 
 * @scenarios_covered:
 *   ✅ SCENARIO-004: 验证-证件号为空
 *   ✅ SCENARIO-005: 验证-证件号长度不正确
 *   ✅ SCENARIO-006: 验证-验证码为空
 *   ✅ SCENARIO-007: 验证-验证码长度不正确
 *   ✅ SCENARIO-008: 验证-验证码错误
 *   ✅ SCENARIO-009: 验证-验证码过期
 *   ✅ SCENARIO-010: 验证-成功
 */
async function verifySmsCode(username, idNumber, code) {
  return new Promise((resolve, reject) => {
    // SCENARIO-004 & SCENARIO-005: 证件号验证
    if (!idNumber || idNumber.length !== 4) {
      resolve({
        success: false,
        message: '请输入登录账号绑定的证件号后4位'
      });
      return;
    }
    
    // SCENARIO-006: 验证码为空
    if (!code) {
      resolve({
        success: false,
        message: '请输入验证码'
      });
      return;
    }
    
    // SCENARIO-007: 验证码长度不正确
    if (code.length < 6) {
      resolve({
        success: false,
        message: '请输入正确的验证码'
      });
      return;
    }
    
    const db = getDatabase();
    
    // 1. 验证用户和证件号
    const userQuery = `
      SELECT id, id_number
      FROM users
      WHERE username = ? OR email = ? OR phone = ?
      LIMIT 1
    `;
    
    db.get(userQuery, [username, username, username], (err, user) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (!user || user.id_number !== idNumber) {
        resolve({
          success: false,
          message: '请输入正确的用户信息！'
        });
        return;
      }
      
      // 2. 查询验证码记录
      const codeQuery = `
        SELECT id, code, expires_at, used
        FROM verification_codes
        WHERE user_id = ? AND type = 'sms' AND used = 0
        ORDER BY created_at DESC
        LIMIT 1
      `;
      
      db.get(codeQuery, [user.id], (err, record) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (!record) {
          // SCENARIO-008: 验证码错误（找不到未使用的验证码）
          resolve({
            success: false,
            message: '很抱歉，您输入的短信验证码有误。'
          });
          return;
        }
        
        // 检查验证码是否过期
        // SQLite stores timestamps as UTC strings, need to add 'UTC' for correct parsing
        const expiresAt = new Date(record.expires_at).getTime();
        const now = Date.now();
        
        if (now > expiresAt) {
          // SCENARIO-009: 验证码过期
          resolve({
            success: false,
            message: '验证码已过期'
          });
          return;
        }
        
        if (record.code !== code) {
          // SCENARIO-008: 验证码错误
          resolve({
            success: false,
            message: '很抱歉，您输入的短信验证码有误。'
          });
          return;
        }
        
        // 3. 标记验证码已使用
        const updateQuery = `
          UPDATE verification_codes
          SET used = 1
          WHERE id = ?
        `;
        
        db.run(updateQuery, [record.id], (err) => {
          if (err) {
            reject(err);
            return;
          }
          
          // SCENARIO-010: 验证成功
          const token = `token_${user.id}_${Date.now()}`; // 简单的token生成
          resolve({
            success: true,
            message: '验证成功',
            token
          });
        });
      });
    });
  });
}

module.exports = {
  authenticateUser,
  sendVerificationCode,
  verifySmsCode
};

