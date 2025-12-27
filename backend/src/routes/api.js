/**
 * @file API Routes
 * @description RESTful API endpoints for 12306 Login System
 */

const express = require('express');
const router = express.Router();
const { sendSuccess, sendError, sendNotImplemented } = require('../utils/response');
const operations = require('../database/operations');

/**
 * @api API-LOGIN POST /auth/login
 * @summary 用户登录接口
 * @param {Object} body - { username: string, password: string }
 * @returns {Object} response - { success: boolean, message: string, needVerification?: boolean }
 * @calls FUNC-AUTHENTICATE-USER
 * 
 * @scenarios_covered:
 *   ✅ SCENARIO-004: 用户名未注册
 *   ✅ SCENARIO-005: 密码错误
 *   ✅ SCENARIO-006: 登录成功
 */
router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 调用 FUNC-AUTHENTICATE-USER
    const result = await operations.authenticateUser(username, password);

    if (result.success) {
      // SCENARIO-006: 登录成功
      res.json({
        success: true,
        message: '登录成功',
        needVerification: true,
        userId: result.userId
      });
    } else {
      // SCENARIO-004 & SCENARIO-005: 用户名未注册 或 密码错误
      res.json({
        success: false,
        message: result.message || '用户名或密码错误！'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    sendError(res, '服务器内部错误', 500);
  }
});

/**
 * @api API-SEND-SMS POST /auth/send-verification-code
 * @summary 发送短信验证码接口
 * @param {Object} body - { username: string, idNumber: string }
 * @returns {Object} response - { success: boolean, message: string, code?: string }
 * @calls FUNC-SEND-VERIFICATION-CODE
 * 
 * @scenarios_covered:
 *   ✅ SCENARIO-001: 获取验证码-证件号错误
 *   ✅ SCENARIO-002: 获取验证码-成功
 *   ✅ SCENARIO-003: 获取验证码-频率限制
 */
router.post('/auth/send-verification-code', async (req, res) => {
  try {
    const { username, idNumber } = req.body;

    // 调用 FUNC-SEND-VERIFICATION-CODE
    const result = await operations.sendVerificationCode(username, idNumber);

    if (result.success) {
      // SCENARIO-002: 成功
      res.json({
        success: true,
        message: '验证码已发送',
        code: result.code // 开发环境下返回验证码（生产环境应移除）
      });
    } else {
      // SCENARIO-001 & SCENARIO-003: 证件号错误 或 频率限制
      res.json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Send verification code error:', error);
    sendError(res, '服务器内部错误', 500);
  }
});

/**
 * @api API-VERIFY-SMS POST /auth/verify-sms
 * @summary 验证短信验证码接口
 * @param {Object} body - { username: string, idNumber: string, code: string }
 * @returns {Object} response - { success: boolean, message: string, token?: string }
 * @calls FUNC-VERIFY-SMS-CODE
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
router.post('/auth/verify-sms', async (req, res) => {
  try {
    const { username, idNumber, code } = req.body;

    // 调用 FUNC-VERIFY-SMS-CODE
    const result = await operations.verifySmsCode(username, idNumber, code);

    if (result.success) {
      // SCENARIO-010: 验证成功
      res.json({
        success: true,
        message: '验证成功',
        token: result.token
      });
    } else {
      // SCENARIO-004 ~ SCENARIO-009: 各种错误情况
      res.json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Verify SMS error:', error);
    sendError(res, '服务器内部错误', 500);
  }
});

module.exports = router;

