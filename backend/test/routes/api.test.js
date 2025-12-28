/**
 * API Routes Integration Tests
 * Test API endpoints for authentication and verification
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import apiRouter from '../../src/routes/api.js';
import { getDb } from '../../src/database/db.js';

// Create test app
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/', apiRouter);

let testUserId;

describe('API Integration Tests', () => {
  beforeAll(async () => {
    // Ensure test database is ready
    const db = getDb();
    const user = await db.getAsync('SELECT id FROM users WHERE username = ?', 'testuser');
    testUserId = user.id;
  });

  beforeEach(async () => {
    // Clean up verification_codes and sessions
    const db = getDb();
    await db.runAsync('DELETE FROM sessions');
    await db.runAsync('DELETE FROM verification_codes');
  });

  describe('API-LOGIN: POST /api/auth/login', () => {
    it('应该接受有效的用户名和密码', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.userId).toBeDefined();
      expect(typeof response.body.userId).toBe('number');
    });

    it('应该接受邮箱登录', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'test@12306.cn',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('应该接受手机号登录', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: '13800138000',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('应该拒绝错误的用户名', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('用户名或密码错误！');
    });

    it('应该拒绝错误的密码', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('用户名或密码错误！');
    });

    it('应该拒绝空用户名', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: '',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('用户名');
    });

    it('应该拒绝空密码', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: ''
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('密码');
    });
  });

  describe('API-SEND-VERIFICATION-CODE: POST /api/auth/send-verification-code', () => {
    it('应该为有效用户发送验证码', async () => {
      const response = await request(app)
        .post('/api/auth/send-verification-code')
        .send({
          userId: testUserId,
          idCardLast4: '1234'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('成功');
    });

    it('应该拒绝错误的证件号', async () => {
      const response = await request(app)
        .post('/api/auth/send-verification-code')
        .send({
          userId: testUserId,
          idCardLast4: '9999'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('请输入正确的用户信息！');
    });

    it('应该拒绝缺少userId', async () => {
      const response = await request(app)
        .post('/api/auth/send-verification-code')
        .send({
          idCardLast4: '1234'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('应该拒绝缺少idCardLast4', async () => {
      const response = await request(app)
        .post('/api/auth/send-verification-code')
        .send({
          userId: testUserId
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('API-VERIFY-CODE: POST /api/auth/verify-code', () => {
    let verificationCode;

    beforeEach(async () => {
      // Generate a verification code first
      const response = await request(app)
        .post('/api/auth/send-verification-code')
        .send({
          userId: testUserId,
          idCardLast4: '1234'
        });

      // Extract code from database
      const db = getDb();
      const codeRecord = await db.getAsync(
        'SELECT code FROM verification_codes WHERE user_id = ?',
        testUserId
      );
      verificationCode = codeRecord.code;
    });

    it('应该接受正确的验证码', async () => {
      const response = await request(app)
        .post('/api/auth/verify-code')
        .send({
          userId: testUserId,
          code: verificationCode
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    });

    it('应该拒绝错误的验证码', async () => {
      const response = await request(app)
        .post('/api/auth/verify-code')
        .send({
          userId: testUserId,
          code: '000000'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('错误');
    });

    it('应该拒绝缺少userId', async () => {
      const response = await request(app)
        .post('/api/auth/verify-code')
        .send({
          code: verificationCode
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('应该拒绝缺少code', async () => {
      const response = await request(app)
        .post('/api/auth/verify-code')
        .send({
          userId: testUserId
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});

