/**
 * @test Backend Integration Tests - API Routes
 * @description 测试 API 接口（API-LOGIN, API-SEND-SMS, API-VERIFY-SMS）
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from '../../src/routes/api.js';
import { runDatabase } from '../../src/database/db.js';

// 创建测试用的 Express 应用
let app;

beforeAll(() => {
  app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use('/api', router);
});

describe('API-LOGIN - POST /api/auth/login', () => {
  /**
   * @scenario SCENARIO-001 "用户名为空"
   * @given 请求体缺少用户名
   * @when 发送 POST 请求到 /api/auth/login
   * @then 返回 400 错误
   */
  it('SCENARIO-001: 应该返回错误 - 用户名为空', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ password: 'test123456' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('不能为空');
  });

  /**
   * @scenario SCENARIO-002 "密码为空"
   * @given 请求体缺少密码
   * @when 发送 POST 请求到 /api/auth/login
   * @then 返回 400 错误
   */
  it('SCENARIO-002: 应该返回错误 - 密码为空', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  /**
   * @scenario SCENARIO-003 "用户名未注册"
   * @given 用户名不存在于数据库
   * @when 发送 POST 请求
   * @then 返回 400 错误，消息"用户名或密码错误"
   */
  it('SCENARIO-003: 应该返回错误 - 用户名未注册', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'nonexistent_user',
        password: 'anypassword',
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('用户名或密码错误！');
  });

  /**
   * @scenario SCENARIO-004 "密码错误"
   * @given 用户名存在但密码错误
   * @when 发送 POST 请求
   * @then 返回 400 错误
   */
  it('SCENARIO-004: 应该返回错误 - 密码错误', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('用户名或密码错误！');
  });

  /**
   * @scenario SCENARIO-005 "登录成功 - 用户名"
   * @given 正确的用户名和密码
   * @when 发送 POST 请求
   * @then 返回 200 OK，包含 userId 和 username
   */
  it('SCENARIO-005: 应该登录成功 - 使用用户名', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'test123456',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.userId).toBeDefined();
    expect(response.body.username).toBe('testuser');
  });

  /**
   * @scenario SCENARIO-006 "登录成功 - 邮箱"
   * @given 正确的邮箱和密码
   * @when 发送 POST 请求
   * @then 返回 200 OK
   */
  it('SCENARIO-006: 应该登录成功 - 使用邮箱', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'test@12306.cn',
        password: 'test123456',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  /**
   * @scenario SCENARIO-007 "登录成功 - 手机号"
   * @given 正确的手机号和密码
   * @when 发送 POST 请求
   * @then 返回 200 OK
   */
  it('SCENARIO-007: 应该登录成功 - 使用手机号', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: '13800138000',
        password: 'test123456',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});

describe('API-SEND-SMS - POST /api/auth/send-sms', () => {
  let testUserId;

  beforeAll(async () => {
    // 获取测试用户 ID
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'test123456' });
    testUserId = response.body.userId;
  });

  /**
   * @scenario SCENARIO-001 "参数缺失"
   * @given 请求体缺少必需参数
   * @when 发送 POST 请求
   * @then 返回 400 错误
   */
  it('SCENARIO-001: 应该返回错误 - 参数缺失', async () => {
    const response = await request(app)
      .post('/api/auth/send-sms')
      .send({ userId: testUserId });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  /**
   * @scenario SCENARIO-002 "证件号长度错误"
   * @given 证件号后4位长度不是4位
   * @when 发送 POST 请求
   * @then 返回 400 错误
   */
  it('SCENARIO-002: 应该返回错误 - 证件号长度错误', async () => {
    const response = await request(app)
      .post('/api/auth/send-sms')
      .send({
        userId: testUserId,
        idCardLast4: '123', // 只有3位
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('4位');
  });

  /**
   * @scenario SCENARIO-003 "证件号错误"
   * @given 证件号后4位不匹配
   * @when 发送 POST 请求
   * @then 返回 400 错误
   */
  it('SCENARIO-003: 应该返回错误 - 证件号错误', async () => {
    const response = await request(app)
      .post('/api/auth/send-sms')
      .send({
        userId: testUserId,
        idCardLast4: '9999',
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('正确的用户信息');
  });

  /**
   * @scenario SCENARIO-004 "发送成功"
   * @given 正确的 userId 和证件号
   * @when 发送 POST 请求
   * @then 返回 200 OK，包含验证码
   */
  it('SCENARIO-004: 应该成功发送验证码', async () => {
    // 先清空验证码表
    await runDatabase('DELETE FROM verification_codes', []);

    const response = await request(app)
      .post('/api/auth/send-sms')
      .send({
        userId: testUserId,
        idCardLast4: '1234',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.code).toBeDefined();
    expect(response.body.code).toHaveLength(6);
  });
});

describe('API-VERIFY-SMS - POST /api/auth/verify-sms', () => {
  let testUserId;
  let verificationCode;

  beforeAll(async () => {
    // 清空验证码表
    await runDatabase('DELETE FROM verification_codes', []);

    // 获取测试用户 ID
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'test123456' });
    testUserId = loginResponse.body.userId;

    // 生成验证码
    const smsResponse = await request(app)
      .post('/api/auth/send-sms')
      .send({
        userId: testUserId,
        idCardLast4: '1234',
      });
    verificationCode = smsResponse.body.code;
  });

  /**
   * @scenario SCENARIO-001 "参数缺失"
   * @given 请求体缺少必需参数
   * @when 发送 POST 请求
   * @then 返回 400 错误
   */
  it('SCENARIO-001: 应该返回错误 - 参数缺失', async () => {
    const response = await request(app)
      .post('/api/auth/verify-sms')
      .send({ userId: testUserId, idCardLast4: '1234' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  /**
   * @scenario SCENARIO-002 "验证码长度错误"
   * @given 验证码长度不是6位
   * @when 发送 POST 请求
   * @then 返回 400 错误
   */
  it('SCENARIO-002: 应该返回错误 - 验证码长度错误', async () => {
    const response = await request(app)
      .post('/api/auth/verify-sms')
      .send({
        userId: testUserId,
        idCardLast4: '1234',
        code: '12345', // 只有5位
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  /**
   * @scenario SCENARIO-003 "验证码错误"
   * @given 验证码不正确
   * @when 发送 POST 请求
   * @then 返回 400 错误
   */
  it('SCENARIO-003: 应该返回错误 - 验证码错误', async () => {
    const response = await request(app)
      .post('/api/auth/verify-sms')
      .send({
        userId: testUserId,
        idCardLast4: '1234',
        code: '000000',
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  /**
   * @scenario SCENARIO-004 "验证成功"
   * @given 正确的参数和验证码
   * @when 发送 POST 请求
   * @then 返回 200 OK
   */
  it('SCENARIO-004: 应该验证成功', async () => {
    const response = await request(app)
      .post('/api/auth/verify-sms')
      .send({
        userId: testUserId,
        idCardLast4: '1234',
        code: verificationCode,
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});

