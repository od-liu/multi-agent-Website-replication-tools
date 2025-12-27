/**
 * @file Database Operations Unit Tests
 * @description Tests for FUNC-AUTHENTICATE-USER, FUNC-SEND-VERIFICATION-CODE, FUNC-VERIFY-SMS-CODE
 */

import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEST_DB_PATH = path.join(__dirname, '../../test_database.db');

// Set environment variables BEFORE importing operations
process.env.TEST_MODE = 'true';
process.env.TEST_DB_PATH = TEST_DB_PATH;

// Now import operations after env vars are set
const db = require('../../src/database/db.js');
const operations = require('../../src/database/operations.js');
const { authenticateUser, sendVerificationCode, verifySmsCode } = operations;

beforeAll(() => {
  // Reset database connection to use test database
  db.resetDatabase();
});

afterEach(async () => {
  // Clean up verification codes after each test
  return new Promise((resolve) => {
    const db = new sqlite3.Database(TEST_DB_PATH);
    db.run('DELETE FROM verification_codes', () => {
      db.close();
      resolve();
    });
  });
});

describe('FUNC-AUTHENTICATE-USER', () => {
  /**
   * @scenario SCENARIO-004: 用户名未注册
   * @given 用户输入未注册的用户名
   * @when 调用 authenticateUser
   * @then 返回 { success: false, message: '用户名或密码错误！' }
   */
  it('should return error for unregistered username', async () => {
    const result = await authenticateUser('nonexistent', 'anypassword');
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('用户名或密码错误！');
  });

  /**
   * @scenario SCENARIO-005: 密码错误
   * @given 用户输入已注册的用户名但密码错误
   * @when 调用 authenticateUser
   * @then 返回 { success: false, message: '用户名或密码错误！' }
   */
  it('should return error for wrong password', async () => {
    const result = await authenticateUser('testuser', 'wrongpassword');
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('用户名或密码错误！');
  });

  /**
   * @scenario SCENARIO-006: 登录成功
   * @given 用户输入正确的用户名和密码
   * @when 调用 authenticateUser
   * @then 返回 { success: true, userId: number }
   */
  it('should return success for correct credentials', async () => {
    const result = await authenticateUser('testuser', 'password123');
    
    expect(result.success).toBe(true);
    expect(result.message).toBe('登录成功');
    expect(result.userId).toBeDefined();
    expect(typeof result.userId).toBe('number');
  });

  it('should authenticate with email', async () => {
    const result = await authenticateUser('test@example.com', 'password123');
    
    expect(result.success).toBe(true);
  });

  it('should authenticate with phone', async () => {
    const result = await authenticateUser('13800138000', 'password123');
    
    expect(result.success).toBe(true);
  });
});

describe('FUNC-SEND-VERIFICATION-CODE', () => {
  /**
   * @scenario SCENARIO-001: 获取验证码-证件号错误
   * @given 用户输入错误的证件号后4位
   * @when 调用 sendVerificationCode
   * @then 返回 { success: false, message: '请输入正确的用户信息！' }
   */
  it('should return error for wrong ID number', async () => {
    const result = await sendVerificationCode('testuser', '9999');
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('请输入正确的用户信息！');
  });

  /**
   * @scenario SCENARIO-002: 获取验证码-成功
   * @given 用户输入正确的证件号后4位
   * @when 调用 sendVerificationCode
   * @then 返回 { success: true, code: string }
   */
  it('should send verification code successfully', async () => {
    const result = await sendVerificationCode('testuser', '1234');
    
    expect(result.success).toBe(true);
    expect(result.message).toBe('验证码已发送');
    expect(result.code).toBeDefined();
    expect(result.code.length).toBe(6);
    expect(/^\d{6}$/.test(result.code)).toBe(true);
  });

  /**
   * @scenario SCENARIO-003: 获取验证码-频率限制
   * @given 用户在1分钟内已发送过验证码
   * @when 再次调用 sendVerificationCode
   * @then 返回 { success: false, message: '请求验证码过于频繁，请稍后再试！' }
   */
  it('should enforce rate limiting', async () => {
    // Clean up first to ensure clean state
    await new Promise((resolve) => {
      const db = new sqlite3.Database(TEST_DB_PATH);
      db.run('DELETE FROM verification_codes', () => {
        db.close();
        resolve();
      });
    });
    
    // First request - should succeed
    const result1 = await sendVerificationCode('testuser', '1234');
    expect(result1.success).toBe(true);
    
    // Second request immediately - should fail
    const result2 = await sendVerificationCode('testuser', '1234');
    expect(result2.success).toBe(false);
    expect(result2.message).toBe('请求验证码过于频繁，请稍后再试！');
  });

  it('should work with email as username', async () => {
    const result = await sendVerificationCode('test@example.com', '1234');
    expect(result.success).toBe(true);
  });

  it('should work with phone as username', async () => {
    const result = await sendVerificationCode('13800138000', '1234');
    expect(result.success).toBe(true);
  });
});

describe('FUNC-VERIFY-SMS-CODE', () => {
  /**
   * @scenario SCENARIO-004: 验证-证件号为空
   * @given 用户未输入证件号
   * @when 调用 verifySmsCode
   * @then 返回错误提示
   */
  it('should return error for empty ID number', async () => {
    const result = await verifySmsCode('testuser', '', '123456');
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('请输入登录账号绑定的证件号后4位');
  });

  /**
   * @scenario SCENARIO-005: 验证-证件号长度不正确
   * @given 用户输入的证件号不是4位
   * @when 调用 verifySmsCode
   * @then 返回错误提示
   */
  it('should return error for invalid ID number length', async () => {
    const result = await verifySmsCode('testuser', '123', '123456');
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('请输入登录账号绑定的证件号后4位');
  });

  /**
   * @scenario SCENARIO-006: 验证-验证码为空
   * @given 用户未输入验证码
   * @when 调用 verifySmsCode
   * @then 返回错误提示
   */
  it('should return error for empty code', async () => {
    const result = await verifySmsCode('testuser', '1234', '');
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('请输入验证码');
  });

  /**
   * @scenario SCENARIO-007: 验证-验证码长度不正确
   * @given 用户输入的验证码少于6位
   * @when 调用 verifySmsCode
   * @then 返回错误提示
   */
  it('should return error for invalid code length', async () => {
    const result = await verifySmsCode('testuser', '1234', '12345');
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('请输入正确的验证码');
  });

  /**
   * @scenario SCENARIO-008: 验证-验证码错误
   * @given 用户输入错误的验证码
   * @when 调用 verifySmsCode
   * @then 返回错误提示
   */
  it('should return error for wrong code', async () => {
    // First send a code
    const sendResult = await sendVerificationCode('testuser', '1234');
    expect(sendResult.success).toBe(true);
    
    // Try to verify with wrong code
    const result = await verifySmsCode('testuser', '1234', '999999');
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('很抱歉，您输入的短信验证码有误。');
  });

  /**
   * @scenario SCENARIO-009: 验证-验证码过期
   * @given 用户输入的验证码已过期
   * @when 调用 verifySmsCode
   * @then 返回错误提示
   */
  it('should return error for expired code', async () => {
    // First send a valid code
    const sendResult = await sendVerificationCode('testuser', '1234');
    const code = sendResult.code;
    
    // Manually update the code to be expired
    const db = new sqlite3.Database(TEST_DB_PATH);
    const expiredTime = new Date(Date.now() - 6 * 60 * 1000).toISOString();
    
    await new Promise((resolve) => {
      db.run(
        'UPDATE verification_codes SET expires_at = ? WHERE code = ?',
        [expiredTime, code],
        () => {
          db.close();
          resolve();
        }
      );
    });
    
    const result = await verifySmsCode('testuser', '1234', code);
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('验证码已过期');
  });

  /**
   * @scenario SCENARIO-010: 验证-成功
   * @given 用户输入正确的证件号和验证码
   * @when 调用 verifySmsCode
   * @then 返回 { success: true, token: string }
   */
  it('should verify code successfully', async () => {
    // First send a code
    const sendResult = await sendVerificationCode('testuser', '1234');
    expect(sendResult.success).toBe(true);
    const code = sendResult.code;
    
    // Verify with correct code
    const result = await verifySmsCode('testuser', '1234', code);
    
    expect(result.success).toBe(true);
    expect(result.message).toBe('验证成功');
    expect(result.token).toBeDefined();
    expect(typeof result.token).toBe('string');
  });

  it('should mark code as used after successful verification', async () => {
    // Send and verify code
    const sendResult = await sendVerificationCode('testuser', '1234');
    const code = sendResult.code;
    
    const result1 = await verifySmsCode('testuser', '1234', code);
    expect(result1.success).toBe(true);
    
    // Try to verify again with same code - should fail
    const result2 = await verifySmsCode('testuser', '1234', code);
    expect(result2.success).toBe(false);
    expect(result2.message).toBe('很抱歉，您输入的短信验证码有误。');
  });
});
