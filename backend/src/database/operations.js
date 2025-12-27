/**
 * 数据库操作函数
 * 包含用户认证、验证码管理等业务逻辑
 */

import { getOneRecord, runDatabase, queryDatabase } from './db.js';

/**
 * @function FUNC-AUTHENTICATE-USER
 * @signature authenticateUser(username, password)
 * @input {string} username - 用户名/邮箱/手机号
 * @input {string} password - 密码
 * @output {object} result - { success: boolean, userId?: number, message?: string }
 * @db_ops SELECT on users table
 * 
 * 认证用户凭据
 * - 查找用户（支持用户名/邮箱/手机号）
 * - 验证密码
 * - 返回用户ID或错误消息
 */
export async function authenticateUser(username, password) {
  try {
    // 查找用户（支持用户名/邮箱/手机号三种方式登录）
    const sql = `
      SELECT id, username, password, id_card_last4
      FROM users
      WHERE username = ? OR email = ? OR phone = ?
    `;
    
    const user = await getOneRecord(sql, [username, username, username]);

    if (!user) {
      // 用户不存在
      return {
        success: false,
        message: '用户名或密码错误！',
      };
    }

    // 验证密码（实际项目中应使用bcrypt等加密方式）
    if (user.password !== password) {
      // 密码错误
      return {
        success: false,
        message: '用户名或密码错误！',
      };
    }

    // 认证成功
    return {
      success: true,
      userId: user.id,
      username: user.username,
      idCardLast4: user.id_card_last4,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

/**
 * @function FUNC-GENERATE-CODE
 * @signature generateVerificationCode(userId, idCardLast4)
 * @input {number} userId - 用户ID
 * @input {string} idCardLast4 - 用户输入的证件号后4位
 * @output {object} result - { success: boolean, code?: string, message?: string }
 * @db_ops SELECT on users, INSERT on verification_codes
 * 
 * 生成验证码
 * - 验证证件号后4位
 * - 生成6位随机验证码
 * - 保存到数据库（5分钟有效期）
 * - 返回验证码
 */
export async function generateVerificationCode(userId, idCardLast4) {
  try {
    // 验证证件号后4位
    const userSql = 'SELECT id_card_last4 FROM users WHERE id = ?';
    const user = await getOneRecord(userSql, [userId]);

    if (!user) {
      return {
        success: false,
        message: '用户不存在！',
      };
    }

    if (user.id_card_last4 !== idCardLast4) {
      return {
        success: false,
        message: '请输入正确的用户信息！',
      };
    }

    // 检查是否在1分钟内已发送过验证码
    const checkSql = `
      SELECT id FROM verification_codes
      WHERE user_id = ?
      AND created_at > datetime('now', '-1 minute')
      AND is_used = 0
    `;
    const recentCode = await getOneRecord(checkSql, [userId]);

    if (recentCode) {
      return {
        success: false,
        message: '请求验证码过于频繁，请稍后再试！',
      };
    }

    // 生成6位随机验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 保存验证码到数据库（5分钟有效期）
    const insertSql = `
      INSERT INTO verification_codes (user_id, code, expires_at)
      VALUES (?, ?, datetime('now', '+5 minutes'))
    `;
    await runDatabase(insertSql, [userId, code]);

    // 在实际项目中，这里应该发送短信
    console.log(`[SMS] Verification code for user ${userId}: ${code}`);

    return {
      success: true,
      code, // 实际项目中不应返回验证码，这里为了演示目的
      message: '验证码已发送，请注意查收。',
    };
  } catch (error) {
    console.error('Generate code error:', error);
    throw error;
  }
}

/**
 * @function FUNC-VERIFY-CODE
 * @signature verifyCode(userId, idCardLast4, code)
 * @input {number} userId - 用户ID
 * @input {string} idCardLast4 - 证件号后4位
 * @input {string} code - 验证码
 * @output {object} result - { success: boolean, message?: string }
 * @db_ops SELECT on users, SELECT/UPDATE on verification_codes
 * 
 * 验证验证码
 * - 验证证件号后4位
 * - 验证验证码是否正确且未过期
 * - 标记验证码为已使用
 */
export async function verifyCode(userId, idCardLast4, code) {
  try {
    // 验证证件号后4位
    const userSql = 'SELECT id_card_last4 FROM users WHERE id = ?';
    const user = await getOneRecord(userSql, [userId]);

    if (!user) {
      return {
        success: false,
        message: '用户不存在！',
      };
    }

    if (user.id_card_last4 !== idCardLast4) {
      return {
        success: false,
        message: '请输入正确的用户信息！',
      };
    }

    // 查找验证码并检查是否过期（使用 SQLite 的 datetime 进行比较）
    const codeSql = `
      SELECT id, code, expires_at, is_used,
             CASE WHEN expires_at > datetime('now') THEN 0 ELSE 1 END as is_expired
      FROM verification_codes
      WHERE user_id = ? AND code = ?
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const codeRecord = await getOneRecord(codeSql, [userId, code]);

    if (!codeRecord) {
      return {
        success: false,
        message: '很抱歉，您输入的短信验证码有误。',
      };
    }

    if (codeRecord.is_used === 1) {
      return {
        success: false,
        message: '验证码已使用，请重新获取。',
      };
    }

    // 检查是否过期（使用 SQLite 计算的结果）
    if (codeRecord.is_expired === 1) {
      return {
        success: false,
        message: '验证码已过期',
      };
    }

    // 标记验证码为已使用
    const updateSql = 'UPDATE verification_codes SET is_used = 1 WHERE id = ?';
    await runDatabase(updateSql, [codeRecord.id]);

    return {
      success: true,
      message: '验证成功',
    };
  } catch (error) {
    console.error('Verify code error:', error);
    throw error;
  }
}
