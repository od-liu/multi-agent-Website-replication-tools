/**
 * @file Response Utilities
 * @description Helper functions for API responses
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {Object} data - Response data
 * @param {String} message - Success message
 */
function sendSuccess(res, data = {}, message = 'Success') {
  res.json({
    success: true,
    message,
    ...data
  });
}

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @param {Number} statusCode - HTTP status code
 */
function sendError(res, message = 'Error', statusCode = 400) {
  res.status(statusCode).json({
    success: false,
    message
  });
}

/**
 * Send not implemented response (501)
 * @param {Object} res - Express response object
 * @param {Object} mockData - Mock data to return
 */
function sendNotImplemented(res, mockData = {}) {
  res.status(501).json({
    success: false,
    message: 'Not Implemented - This is skeleton code',
    mockData
  });
}

module.exports = {
  sendSuccess,
  sendError,
  sendNotImplemented
};

