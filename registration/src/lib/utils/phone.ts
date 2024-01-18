import validator from 'validator';

/**
 * Masks a phone number.
 *
 * @param {string} phone - The phone number to mask.
 * @returns {string} - the masked phone number.
 */
export const maskPhone = (phone: string): string => {
	const code = phone.slice(0, 3);
	const number = phone.slice(3);

	const inBetween = number
		.slice(3, number.length - 1)
		.replace(/(\d{3})(?=\d)/g, '$1 ')
		.replace(/[0-9]/g, '*')

	return `${code} ${number.slice(0, 3)} ${inBetween} ${number.slice(-1)}`;
};

/**
 * Check if the given phone number is valid.
 *
 * @param {string} phone - the phone number to check.
 * @returns {boolean} - true if the phone number is valid, false otherwise.
 */
export const isPhoneValid = (phone: string): boolean => {
	return validator.isMobilePhone(phone);
};
