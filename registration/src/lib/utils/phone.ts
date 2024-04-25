import { parsePhoneNumberWithError } from 'svelte-tel-input';
import validator from 'validator';

/**
 * Masks a phone number.
 *
 * @param {string} phone - The phone number to mask.
 * @returns {string} - the masked phone number.
 */
export const maskPhone = (phone: string): string => {
	const parsed = parsePhoneNumberWithError(phone);
	const code = parsed.countryCallingCode;
	const number = parsed.nationalNumber;
	const firstPart = number.substring(0, 2);
	const lastPart = number.substring(number.length - 2);
	const middlePart = number.substring(2, number.length - 2);
	const middleMask = middlePart.replace(/\d/g, '*');

	return `+${code} ${firstPart} ${middleMask} ${lastPart}`;
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
