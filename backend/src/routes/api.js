/**
 * Backend API Routes
 * 定义所有API端点
 */

import express from 'express';
import { authenticateUser, generateVerificationCode, verifyCode } from '../database/operations.js';

const router = express.Router();

/**
 * @api API-LOGIN POST /api/auth/login
 * @summary 用户登录接口
 * @param {Object} body - 请求体
 * @param {string} body.username - 用户名/邮箱/手机号
 * @param {string} body.password - 密码
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 登录是否成功
 * @returns {string} response.message - 响应消息
 * @returns {string} response.userId - 用户ID（成功时）
 * @calls FUNC-AUTH-LOGIN - 委托给认证服务函数
 */
router.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  // 参数验证
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: '用户名和密码不能为空'
    });
  }
  
  // 调用 FUNC-AUTH-LOGIN 进行实际认证
  const result = await authenticateUser(username, password);
  
  if (result.success) {
    return res.status(200).json({
      success: true,
      userId: result.userId
    });
  } else {
    return res.status(401).json({
      success: false,
      message: result.message
    });
  }
});

/**
 * @api API-SEND-VERIFICATION-CODE POST /api/auth/send-verification-code
 * @summary 发送短信验证码
 * @param {Object} body - 请求体
 * @param {string} body.userId - 用户ID
 * @param {string} body.idCardLast4 - 证件号后4位
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 是否发送成功
 * @returns {string} response.message - 响应消息
 * @calls FUNC-SEND-VERIFICATION-CODE
 */
router.post('/api/auth/send-verification-code', async (req, res) => {
  const { userId, idCardLast4 } = req.body;
  
  if (!userId || !idCardLast4) {
    return res.status(400).json({
      success: false,
      message: '参数不完整'
    });
  }
  
  // 调用 FUNC-SEND-VERIFICATION-CODE
  const result = await generateVerificationCode(userId, idCardLast4);
  
  if (result.success) {
    return res.status(200).json({
      success: true,
      message: '获取手机验证码成功！'
    });
  } else {
    return res.status(400).json({
      success: false,
      message: result.message
    });
  }
});

/**
 * @api API-VERIFY-CODE POST /api/auth/verify-code
 * @summary 验证短信验证码
 * @param {Object} body - 请求体
 * @param {string} body.userId - 用户ID
 * @param {string} body.code - 验证码
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 验证是否成功
 * @returns {string} response.message - 响应消息
 * @returns {string} response.token - 登录令牌（成功时）
 * @calls FUNC-VERIFY-CODE
 */
router.post('/api/auth/verify-code', async (req, res) => {
  const { userId, code } = req.body;
  
  if (!userId || !code) {
    return res.status(400).json({
      success: false,
      message: '参数不完整'
    });
  }
  
  // 调用 FUNC-VERIFY-CODE
  const result = await verifyCode(userId, code);
  
  if (result.success) {
    return res.status(200).json({
      success: true,
      token: result.token
    });
  } else {
    return res.status(400).json({
      success: false,
      message: result.message
    });
  }
});

export default router;

