/**
 * @test Backend Unit Tests - Database Operations
 * @description 测试数据库操作函数（FUNC-AUTHENTICATE-USER, FUNC-GENERATE-CODE, FUNC-VERIFY-CODE）
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { authenticateUser, generateVerificationCode, verifyCode } from '../../src/database/operations.js';
import { runDatabase } from '../../src/database/db.js';

describe('FUNC-AUTHENTICATE-USER - authenticateUser()', () => {
  /**
   * @scenario SCENARIO-001 "用户名未注册"
   * @given 用户输入了符合格式要求但未注册的用户名
   * @when 调用 authenticateUser
   * @then 返回 success: false, message: "用户名或密码错误！"
   */
  it('SCENARIO-001: 应该返回错误 - 用户名未注册', async () => {
    const result = await authenticateUser('nonexistent_user', 'anypassword');
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('用户名或密码错误！');
    expect(result.userId).toBeUndefined();
  });

  /**
   * @scenario SCENARIO-002 "密码错误"
   * @given 用户输入了已注册的用户名但密码错误
   * @when 调用 authenticateUser
   * @then 返回 success: false, message: "用户名或密码错误！"
   */
  it('SCENARIO-002: 应该返回错误 - 密码错误', async () => {
    const result = await authenticateUser('testuser', 'wrongpassword');
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('用户名或密码错误！');
    expect(result.userId).toBeUndefined();
  });

  /**
   * @scenario SCENARIO-003 "使用用户名登录成功"
   * @given 用户输入了正确的用户名和密码
   * @when 调用 authenticateUser
   * @then 返回 success: true, userId, username
   */
  it('SCENARIO-003: 应该登录成功 - 使用用户名', async () => {
    const result = await authenticateUser('testuser', 'test123456');
    
    expect(result.success).toBe(true);
    expect(result.userId).toBeDefined();
    expect(result.username).toBe('testuser');
    expect(result.idCardLast4).toBe('1234');
    expect(result.message).toBeUndefined();
  });

  /**
   * @scenario SCENARIO-004 "使用邮箱登录成功"
   * @given 用户输入了正确的邮箱和密码
   * @when 调用 authenticateUser
   * @then 返回 success: true, userId, username
   */
  it('SCENARIO-004: 应该登录成功 - 使用邮箱', async () => {
    const result = await authenticateUser('test@12306.cn', 'test123456');
    
    expect(result.success).toBe(true);
    expect(result.userId).toBeDefined();
    expect(result.username).toBe('testuser');
  });

  /**
   * @scenario SCENARIO-005 "使用手机号登录成功"
   * @given 用户输入了正确的手机号和密码
   * @when 调用 authenticateUser
   * @then 返回 success: true, userId, username
   */
  it('SCENARIO-005: 应该登录成功 - 使用手机号', async () => {
    const result = await authenticateUser('13800138000', 'test123456');
    
    expect(result.success).toBe(true);
    expect(result.userId).toBeDefined();
    expect(result.username).toBe('testuser');
  });
});

describe('FUNC-GENERATE-CODE - generateVerificationCode()', () => {
  /**
   * @scenario SCENARIO-001 "获取验证码-证件号错误"
   * @given 用户输入了错误的证件号后4位
   * @when 调用 generateVerificationCode
   * @then 返回 success: false, message: "请输入正确的用户信息！"
   */
  it('SCENARIO-001: 应该返回错误 - 证件号错误', async () => {
    // 先获取 testuser 的 userId
    const authResult = await authenticateUser('testuser', 'test123456');
    const userId = authResult.userId;
    
    const result = await generateVerificationCode(userId, '9999'); // 错误的证件号
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('请输入正确的用户信息！');
  });

  /**
   * @scenario SCENARIO-002 "获取验证码-成功"
   * @given 用户输入了正确的证件号后4位，且1分钟内未发送过验证码
   * @when 调用 generateVerificationCode
   * @then 返回 success: true, code, message
   */
  it('SCENARIO-002: 应该成功生成验证码 - 证件号正确', async () => {
    // 先清空 verification_codes 表
    await runDatabase('DELETE FROM verification_codes', []);
    
    // 获取 testuser 的 userId
    const authResult = await authenticateUser('testuser', 'test123456');
    const userId = authResult.userId;
    
    const result = await generateVerificationCode(userId, '1234'); // 正确的证件号
    
    expect(result.success).toBe(true);
    expect(result.code).toBeDefined();
    expect(result.code).toHaveLength(6);
    expect(result.message).toContain('验证码已发送');
  });

  /**
   * @scenario SCENARIO-003 "获取验证码-频率限制"
   * @given 用户在1分钟内已发送过验证码
   * @when 再次调用 generateVerificationCode
   * @then 返回 success: false, message: "请求验证码过于频繁"
   */
  it('SCENARIO-003: 应该返回错误 - 频率限制', async () => {
    // 先清空 verification_codes 表
    await runDatabase('DELETE FROM verification_codes', []);
    
    // 获取 testuser 的 userId
    const authResult = await authenticateUser('testuser', 'test123456');
    const userId = authResult.userId;
    
    // 第一次发送验证码
    await generateVerificationCode(userId, '1234');
    
    // 立即第二次发送（应该被拒绝）
    const result = await generateVerificationCode(userId, '1234');
    
    expect(result.success).toBe(false);
    expect(result.message).toContain('频繁');
  });
});

describe('FUNC-VERIFY-CODE - verifyCode()', () => {
  /**
   * @scenario SCENARIO-001 "验证-证件号错误"
   * @given 用户输入了错误的证件号后4位
   * @when 调用 verifyCode
   * @then 返回 success: false
   */
  it('SCENARIO-001: 应该返回错误 - 证件号错误', async () => {
    const authResult = await authenticateUser('testuser', 'test123456');
    const userId = authResult.userId;
    
    const result = await verifyCode(userId, '9999', '123456');
    
    expect(result.success).toBe(false);
  });

  /**
   * @scenario SCENARIO-002 "验证-验证码错误"
   * @given 用户输入了正确的证件号但验证码不正确
   * @when 调用 verifyCode
   * @then 返回 success: false, message: "验证码有误"
   */
  it('SCENARIO-002: 应该返回错误 - 验证码错误', async () => {
    // 先清空并生成新验证码
    await runDatabase('DELETE FROM verification_codes', []);
    const authResult = await authenticateUser('testuser', 'test123456');
    const userId = authResult.userId;
    await generateVerificationCode(userId, '1234');
    
    // 验证错误的验证码
    const result = await verifyCode(userId, '1234', '000000');
    
    expect(result.success).toBe(false);
    expect(result.message).toContain('验证码有误');
  });

  /**
   * @scenario SCENARIO-003 "验证-成功"
   * @given 用户输入了正确的证件号和验证码
   * @when 调用 verifyCode
   * @then 返回 success: true
   */
  it('SCENARIO-003: 应该验证成功 - 证件号和验证码都正确', async () => {
    // 先清空并生成新验证码
    await runDatabase('DELETE FROM verification_codes', []);
    const authResult = await authenticateUser('testuser', 'test123456');
    const userId = authResult.userId;
    const codeResult = await generateVerificationCode(userId, '1234');
    const correctCode = codeResult.code;
    
    // 验证正确的验证码
    const result = await verifyCode(userId, '1234', correctCode);
    
    expect(result.success).toBe(true);
    expect(result.message).toBe('验证成功');
  });

  /**
   * @scenario SCENARIO-004 "验证-验证码已使用"
   * @given 验证码已被使用过
   * @when 再次调用 verifyCode
   * @then 返回 success: false
   */
  it('SCENARIO-004: 应该返回错误 - 验证码已使用', async () => {
    // 先清空并生成新验证码
    await runDatabase('DELETE FROM verification_codes', []);
    const authResult = await authenticateUser('testuser', 'test123456');
    const userId = authResult.userId;
    const codeResult = await generateVerificationCode(userId, '1234');
    const correctCode = codeResult.code;
    
    // 第一次验证（成功）
    await verifyCode(userId, '1234', correctCode);
    
    // 第二次验证同一个验证码（应该失败）
    const result = await verifyCode(userId, '1234', correctCode);
    
    expect(result.success).toBe(false);
    expect(result.message).toContain('已使用');
  });
});
