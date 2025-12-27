/**
 * API路由定义
 * 包含所有认证相关的API接口
 */

import express from 'express';
import { authenticateUser, generateVerificationCode, verifyCode } from '../database/operations.js';
import { successResponse, errorResponse, serverErrorResponse } from '../utils/response.js';

const router = express.Router();

/**
 * @api API-LOGIN POST /api/auth/login
 * @summary 用户登录接口
 * @param {string} body.username - 用户名/邮箱/手机号
 * @param {string} body.password - 密码
 * @returns {object} response - { success: boolean, userId?: number, message?: string }
 * @calls FUNC-AUTHENTICATE-USER - 委托给认证函数
 */
router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 验证请求参数
    if (!username || !password) {
      return errorResponse(res, '用户名和密码不能为空');
    }

    // 调用 FUNC-AUTHENTICATE-USER
    const result = await authenticateUser(username, password);

    if (result.success) {
      return successResponse(res, {
        userId: result.userId,
        username: result.username,
      }, '登录成功');
    } else {
      return errorResponse(res, result.message);
    }
  } catch (error) {
    return serverErrorResponse(res, error);
  }
});

/**
 * @api API-SEND-SMS POST /api/auth/send-sms
 * @summary 发送短信验证码接口
 * @param {number} body.userId - 用户ID
 * @param {string} body.idCardLast4 - 证件号后4位
 * @returns {object} response - { success: boolean, code?: string, message?: string }
 * @calls FUNC-GENERATE-CODE - 委托给生成验证码函数
 */
router.post('/auth/send-sms', async (req, res) => {
  try {
    const { userId, idCardLast4 } = req.body;

    // 验证请求参数
    if (!userId || !idCardLast4) {
      return errorResponse(res, '参数不完整');
    }

    if (idCardLast4.length !== 4) {
      return errorResponse(res, '请输入正确的证件号后4位');
    }

    // 调用 FUNC-GENERATE-CODE
    const result = await generateVerificationCode(userId, idCardLast4);

    if (result.success) {
      return successResponse(res, {
        code: result.code, // 实际项目中不应返回验证码
      }, result.message);
    } else {
      return errorResponse(res, result.message);
    }
  } catch (error) {
    return serverErrorResponse(res, error);
  }
});

/**
 * @api API-VERIFY-SMS POST /api/auth/verify-sms
 * @summary 验证短信验证码接口
 * @param {number} body.userId - 用户ID
 * @param {string} body.idCardLast4 - 证件号后4位
 * @param {string} body.code - 验证码
 * @returns {object} response - { success: boolean, message?: string }
 * @calls FUNC-VERIFY-CODE - 委托给验证码验证函数
 */
router.post('/auth/verify-sms', async (req, res) => {
  try {
    const { userId, idCardLast4, code } = req.body;

    // 验证请求参数
    if (!userId || !idCardLast4 || !code) {
      return errorResponse(res, '参数不完整');
    }

    if (idCardLast4.length !== 4) {
      return errorResponse(res, '请输入正确的证件号后4位');
    }

    if (code.length !== 6) {
      return errorResponse(res, '请输入正确的验证码');
    }

    // 调用 FUNC-VERIFY-CODE
    const result = await verifyCode(userId, idCardLast4, code);

    if (result.success) {
      return successResponse(res, {}, result.message);
    } else {
      return errorResponse(res, result.message);
    }
  } catch (error) {
    return serverErrorResponse(res, error);
  }
});

export default router;
