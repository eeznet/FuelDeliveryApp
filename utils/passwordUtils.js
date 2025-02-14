/**
 * Validate password strength
 * @param {string} password - The password to validate
 * @returns {boolean} - True if the password is strong enough, false otherwise
 */
export const isPasswordStrong = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};
