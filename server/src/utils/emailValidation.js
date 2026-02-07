// Email validation utility
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Checks if the given email is valid.
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
    if (typeof email !== 'string') return false;
    return emailRegex.test(email.trim());
}