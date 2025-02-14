import bcrypt from 'bcrypt';

/**
 * Hash password before storing in the database
 * @param {string} password - The plain text password to hash
 * @returns {Promise<string>} - The hashed password
 */
export const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        // Ensure password is a string and exists
        if (!password || typeof password !== 'string') {
            throw new Error('Password must be a valid string');
        }
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        throw new Error(`Error hashing password: ${error.message}`);
    }
};

/**
 * Compare stored hash with login password
 * @param {string} password - The plain text password entered by the user
 * @param {string} hashedPassword - The stored hashed password
 * @returns {Promise<boolean>} - True if passwords match, false otherwise
 */
export const comparePassword = async (password, hashedPassword) => {
    try {
        // Ensure both password and hashedPassword are strings
        if (!password || typeof password !== 'string' || !hashedPassword || typeof hashedPassword !== 'string') {
            throw new Error('Both password and hashedPassword must be valid strings');
        }
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw new Error(`Error comparing passwords: ${error.message}`);
    }
};
