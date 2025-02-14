import jwt from 'jsonwebtoken';

/**
 * Decode JWT token
 * @param {string} token - The token to decode
 * @returns {Object|null} - Decoded token payload or null if invalid
 */
export const decodeToken = (token) => {
    try {
        return jwt.decode(token);
    } catch (error) {
        return null;
    }
};

/**
 * Verify JWT token
 * @param {string} token - The token to verify
 * @returns {Object|null} - Decoded token payload if valid, null if invalid
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};
