/**
 * Standardized error response handler
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @returns {Object} - Error response object
 */
export const errorResponse = (message, statusCode = 500) => {
    return {
        success: false,
        message,
        statusCode,
    };
};
