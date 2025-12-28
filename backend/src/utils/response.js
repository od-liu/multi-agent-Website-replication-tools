/**
 * Response Utilities
 * Helper functions for API responses
 */

/**
 * Send success response
 */
export function sendSuccess(res, data, message = 'Success') {
  return res.json({
    success: true,
    message,
    data
  });
}

/**
 * Send error response
 */
export function sendError(res, message = 'Error', statusCode = 400) {
  return res.status(statusCode).json({
    success: false,
    message
  });
}

/**
 * Send validation error response
 */
export function sendValidationError(res, errors) {
  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors
  });
}

