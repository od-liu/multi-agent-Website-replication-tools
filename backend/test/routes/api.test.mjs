/**
 * @file API Integration Tests
 * @description Tests for API-LOGIN, API-SEND-SMS, API-VERIFY-SMS
 */

import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import request from 'supertest';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEST_DB_PATH = path.join(__dirname, '../../test_database.db');

// Set environment variables BEFORE importing app
process.env.TEST_MODE = 'true';
process.env.TEST_DB_PATH = TEST_DB_PATH;

// Now import app after env vars are set
const db = require('../../src/database/db.js');
const app = require('../../src/index.js');

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

describe('API-LOGIN: POST /api/auth/login', () => {
  /**
   * @scenario SCENARIO-004: 用户名未注册
   * @given 用户输入未注册的用户名
   * @when 用户点击"立即登录"
   * @then API 返回 { success: false, message: '用户名或密码错误！' }
   */
  it('should return error for unregistered username', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'nonexistent', password: 'anypassword' })
      .expect(200);
    
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('用户名或密码错误！');
  });

  /**
   * @scenario SCENARIO-005: 密码错误
   * @given 用户输入已注册的用户名但密码错误
   * @when 用户点击"立即登录"
   * @then API 返回 { success: false, message: '用户名或密码错误！' }
   */
  it('should return error for wrong password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'wrongpassword' })
      .expect(200);
    
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('用户名或密码错误！');
  });

  /**
   * @scenario SCENARIO-006: 登录成功
   * @given 用户输入正确的用户名和密码
   * @when 用户点击"立即登录"
   * @then API 返回 { success: true, needVerification: true, userId: number }
   */
  it('should return success for correct credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'password123' })
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('登录成功');
    expect(response.body.needVerification).toBe(true);
    expect(response.body.userId).toBeDefined();
  });

  it('should accept email as username', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'test@example.com', password: 'password123' })
      .expect(200);
    
    expect(response.body.success).toBe(true);
  });

  it('should accept phone as username', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: '13800138000', password: 'password123' })
      .expect(200);
    
    expect(response.body.success).toBe(true);
  });

  it('should handle missing credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({})
      .expect(200);
    
    expect(response.body.success).toBe(false);
  });
});

describe('API-SEND-SMS: POST /api/auth/send-verification-code', () => {
  /**
   * @scenario SCENARIO-001: 获取验证码-证件号错误
   * @given 用户输入错误的证件号后4位
   * @when 用户点击"获取验证码"按钮
   * @then API 返回 { success: false, message: '请输入正确的用户信息！' }
   */
  it('should return error for wrong ID number', async () => {
    const response = await request(app)
      .post('/api/auth/send-verification-code')
      .send({ username: 'testuser', idNumber: '9999' })
      .expect(200);
    
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('请输入正确的用户信息！');
  });

  /**
   * @scenario SCENARIO-002: 获取验证码-成功
   * @given 用户输入正确的证件号后4位
   * @when 用户点击"获取验证码"按钮
   * @then API 返回 { success: true, code: string }
   */
  it('should send verification code successfully', async () => {
    const response = await request(app)
      .post('/api/auth/send-verification-code')
      .send({ username: 'testuser', idNumber: '1234' })
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('验证码已发送');
    expect(response.body.code).toBeDefined();
    expect(response.body.code.length).toBe(6);
  });

  /**
   * @scenario SCENARIO-003: 获取验证码-频率限制
   * @given 用户在1分钟内已发送过验证码
   * @when 再次点击"获取验证码"按钮
   * @then API 返回 { success: false, message: '请求验证码过于频繁，请稍后再试！' }
   */
  it('should enforce rate limiting', async () => {
    // First request - should succeed
    const response1 = await request(app)
      .post('/api/auth/send-verification-code')
      .send({ username: 'testuser', idNumber: '1234' })
      .expect(200);
    
    expect(response1.body.success).toBe(true);
    
    // Second request immediately - should fail
    const response2 = await request(app)
      .post('/api/auth/send-verification-code')
      .send({ username: 'testuser', idNumber: '1234' })
      .expect(200);
    
    expect(response2.body.success).toBe(false);
    expect(response2.body.message).toBe('请求验证码过于频繁，请稍后再试！');
  });

  it('should work with email as username', async () => {
    const response = await request(app)
      .post('/api/auth/send-verification-code')
      .send({ username: 'test@example.com', idNumber: '1234' })
      .expect(200);
    
    expect(response.body.success).toBe(true);
  });
});

describe('API-VERIFY-SMS: POST /api/auth/verify-sms', () => {
  /**
   * @scenario SCENARIO-004: 验证-证件号为空
   * @given 用户未输入证件号后4位
   * @when 用户点击"确定"按钮
   * @then API 返回错误提示
   */
  it('should return error for empty ID number', async () => {
    const response = await request(app)
      .post('/api/auth/verify-sms')
      .send({ username: 'testuser', idNumber: '', code: '123456' })
      .expect(200);
    
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('请输入登录账号绑定的证件号后4位');
  });

  /**
   * @scenario SCENARIO-005: 验证-证件号长度不正确
   * @given 用户输入的证件号后4位长度不为4位
   * @when 用户点击"确定"按钮
   * @then API 返回错误提示
   */
  it('should return error for invalid ID number length', async () => {
    const response = await request(app)
      .post('/api/auth/verify-sms')
      .send({ username: 'testuser', idNumber: '123', code: '123456' })
      .expect(200);
    
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('请输入登录账号绑定的证件号后4位');
  });

  /**
   * @scenario SCENARIO-006: 验证-验证码为空
   * @given 用户输入了正确的证件号后4位但未输入验证码
   * @when 用户点击"确定"按钮
   * @then API 返回错误提示
   */
  it('should return error for empty code', async () => {
    const response = await request(app)
      .post('/api/auth/verify-sms')
      .send({ username: 'testuser', idNumber: '1234', code: '' })
      .expect(200);
    
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('请输入验证码');
  });

  /**
   * @scenario SCENARIO-007: 验证-验证码长度不正确
   * @given 用户输入了正确的证件号后4位但验证码少于6位
   * @when 用户点击"确定"按钮
   * @then API 返回错误提示
   */
  it('should return error for invalid code length', async () => {
    const response = await request(app)
      .post('/api/auth/verify-sms')
      .send({ username: 'testuser', idNumber: '1234', code: '12345' })
      .expect(200);
    
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('请输入正确的验证码');
  });

  /**
   * @scenario SCENARIO-008: 验证-验证码错误
   * @given 用户输入错误的验证码
   * @when 用户点击"确定"按钮
   * @then API 返回错误提示
   */
  it('should return error for wrong code', async () => {
    // First send a code
    const sendResponse = await request(app)
      .post('/api/auth/send-verification-code')
      .send({ username: 'testuser', idNumber: '1234' });
    
    expect(sendResponse.body.success).toBe(true);
    
    // Try to verify with wrong code
    const response = await request(app)
      .post('/api/auth/verify-sms')
      .send({ username: 'testuser', idNumber: '1234', code: '999999' })
      .expect(200);
    
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('很抱歉，您输入的短信验证码有误。');
  });

  /**
   * @scenario SCENARIO-010: 验证-成功
   * @given 用户输入正确的证件号和验证码
   * @when 用户点击"确定"按钮
   * @then API 返回 { success: true, token: string }
   */
  it('should verify code successfully', async () => {
    // First send a code
    const sendResponse = await request(app)
      .post('/api/auth/send-verification-code')
      .send({ username: 'testuser', idNumber: '1234' });
    
    const code = sendResponse.body.code;
    
    // Verify with correct code
    const response = await request(app)
      .post('/api/auth/verify-sms')
      .send({ username: 'testuser', idNumber: '1234', code: code })
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('验证成功');
    expect(response.body.token).toBeDefined();
  });

  it('should not allow code reuse', async () => {
    // Send and verify code
    const sendResponse = await request(app)
      .post('/api/auth/send-verification-code')
      .send({ username: 'testuser', idNumber: '1234' });
    
    const code = sendResponse.body.code;
    
    // First verification
    const response1 = await request(app)
      .post('/api/auth/verify-sms')
      .send({ username: 'testuser', idNumber: '1234', code: code });
    
    expect(response1.body.success).toBe(true);
    
    // Try to verify again with same code
    const response2 = await request(app)
      .post('/api/auth/verify-sms')
      .send({ username: 'testuser', idNumber: '1234', code: code });
    
    expect(response2.body.success).toBe(false);
  });
});
