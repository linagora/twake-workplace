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

/**
 * Validates OTP
 *
 * a valid OTP should be:
 * 	- 6 digits long
 *  - contain only numbers
 *
 * @param {string} code - the OTP to validate
 * @return {boolean} - whether the OTP format is valid or not
 */
export const validateOTP = (code: string): boolean => /^\d{6}$/.test(code);
