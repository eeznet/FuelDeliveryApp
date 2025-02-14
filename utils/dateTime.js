import moment from 'moment';

/**
 * Format a date to a readable format
 * @param {Date|string} date - The date to format
 * @param {string} format - The desired format (default is 'YYYY-MM-DD HH:mm:ss')
 * @returns {string} - Formatted date
 */
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
    return moment(date).format(format);
};

/**
 * Check if a date is expired (useful for token expiry or subscription checks)
 * @param {Date|string} date - The date to check
 * @returns {boolean} - True if the date is in the past
 */
export const isExpired = (date) => {
    return moment(date).isBefore(moment());
};
