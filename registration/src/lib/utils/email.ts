/**
 * Validates en email address.
 *
 * @param {string} email - The email address to validate.
 * @returns {boolean} - true if valid, false otherwise
 */
export const validateEmail = (email: string): boolean => {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
