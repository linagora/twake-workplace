/**
 * Validates the complexity of a password
 *
 * a valid password should be:
 *  - minimum 8 characters long
 *  - contain at least one number
 *  - contain at least one special character (!@#$%^&*)
 *  - contain at least one lowercase letter
 *
 * @param {string} password - the password to validate
 * @returns {boolean} - whether the password is valid or not
 */
export const validatePassword = (password: string): boolean =>
	/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/g.test(password);
