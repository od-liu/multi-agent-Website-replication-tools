/**
 * 响应工具函数
 * 用于统一API响应格式
 */

/**
 * 成功响应
 * @param {object} res - Express response object
 * @param {object} data - 响应数据
 * @param {string} message - 响应消息
 */
export function successResponse(res, data = {}, message = 'Success') {
  return res.status(200).json({
    success: true,
    message,
    ...data,
  });
}

/**
 * 错误响应
 * @param {object} res - Express response object
 * @param {string} message - 错误消息
 * @param {number} statusCode - HTTP状态码
 */
export function errorResponse(res, message = 'Error', statusCode = 400) {
  return res.status(statusCode).json({
    success: false,
    message,
  });
}

/**
 * 服务器错误响应
 * @param {object} res - Express response object
 * @param {Error} error - 错误对象
 */
export function serverErrorResponse(res, error) {
  console.error('Server error:', error);
  return res.status(500).json({
    success: false,
    message: '服务器内部错误，请稍后再试。',
  });
}
