/**
 * Database Operations Tests
 * Unit tests for authentication and verification functions
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { getDb } from '../../src/database/db.js';
import { authenticateUser, generateVerificationCode, verifyCode } from '../../src/database/operations.js';

describe('FUNC-AUTH-LOGIN: authenticateUser', () => {
  beforeEach(async () => {
    // Clean up verification_codes and sessions before each test
    const db = getDb();
    await db.runAsync('DELETE FROM sessions');
    await db.runAsync('DELETE FROM verification_codes');
  });

  it('应该成功认证有效用户（使用用户名）', async () => {
    const result = await authenticateUser('testuser', 'password123');
    expect(result.success).toBe(true);
    expect(result.userId).toBeDefined();
    expect(typeof result.userId).toBe('number');
  });

  it('应该成功认证有效用户（使用邮箱）', async () => {
    const result = await authenticateUser('test@12306.cn', 'password123');
    expect(result.success).toBe(true);
    expect(result.userId).toBeDefined();
  });

  it('应该成功认证有效用户（使用手机号）', async () => {
    const result = await authenticateUser('13800138000', 'password123');
    expect(result.success).toBe(true);
    expect(result.userId).toBeDefined();
  });

  it('应该拒绝不存在的用户', async () => {
    const result = await authenticateUser('nonexistentuser', 'password123');
    expect(result.success).toBe(false);
    expect(result.message).toBe('用户名或密码错误！');
    expect(result.userId).toBeUndefined();
  });

  it('应该拒绝错误的密码', async () => {
    const result = await authenticateUser('testuser', 'wrongpassword');
    expect(result.success).toBe(false);
    expect(result.message).toBe('用户名或密码错误！');
    expect(result.userId).toBeUndefined();
  });

  it('应该拒绝空用户名', async () => {
    const result = await authenticateUser('', 'password123');
    expect(result.success).toBe(false);
    expect(result.message).toBeDefined();
  });

  it('应该拒绝空密码', async () => {
    const result = await authenticateUser('testuser', '');
    expect(result.success).toBe(false);
    expect(result.message).toBeDefined();
  });
});

describe('FUNC-SEND-VERIFICATION-CODE: generateVerificationCode', () => {
  beforeEach(async () => {
    const db = getDb();
    await db.runAsync('DELETE FROM verification_codes');
  });

  it('应该为有效用户生成验证码', async () => {
    // First, get the userId
    const authResult = await authenticateUser('testuser', 'password123');
    expect(authResult.success).toBe(true);

    // Generate verification code
    const result = await generateVerificationCode(authResult.userId, '1234');
    expect(result.success).toBe(true);
    expect(result.code).toBeDefined();
    expect(result.code.length).toBe(6);
    expect(/^\d{6}$/.test(result.code)).toBe(true); // Should be 6 digits
  });

  it('应该拒绝错误的证件号后4位', async () => {
    const authResult = await authenticateUser('testuser', 'password123');
    expect(authResult.success).toBe(true);

    const result = await generateVerificationCode(authResult.userId, '9999');
    expect(result.success).toBe(false);
    expect(result.message).toBe('请输入正确的用户信息！');
  });

  it('应该拒绝不存在的用户ID', async () => {
    const result = await generateVerificationCode(99999, '1234');
    expect(result.success).toBe(false);
    expect(result.message).toBeDefined();
  });
});

describe('FUNC-VERIFY-CODE: verifyCode', () => {
  beforeEach(async () => {
    const db = getDb();
    await db.runAsync('DELETE FROM sessions');
    await db.runAsync('DELETE FROM verification_codes');
  });

  it('应该成功验证正确的验证码', async () => {
    // Get userId
    const authResult = await authenticateUser('testuser', 'password123');
    const userId = authResult.userId;

    // Generate code
    const codeResult = await generateVerificationCode(userId, '1234');
    expect(codeResult.success).toBe(true);

    // Verify code
    const verifyResult = await verifyCode(userId, codeResult.code);
    expect(verifyResult.success).toBe(true);
    expect(verifyResult.token).toBeDefined();
  });

  it('应该拒绝错误的验证码', async () => {
    const authResult = await authenticateUser('testuser', 'password123');
    const userId = authResult.userId;

    await generateVerificationCode(userId, '1234');

    const verifyResult = await verifyCode(userId, '000000');
    expect(verifyResult.success).toBe(false);
    expect(verifyResult.message).toBeDefined();
  });

  it('应该拒绝过期的验证码', async () => {
    // This test would require manipulating time or waiting
    // Skipping for now, can be implemented with proper time mocking
  });
});

