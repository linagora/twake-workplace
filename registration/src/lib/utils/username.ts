import { createUserFormSchema } from '$lib/schemas/zodSchema';

/**
 * Validates a name.
 *
 * a valid name must be at least 3 characters long and contain only letters and spaces.
 * @param {string} name - the string to validate.
 * @returns {boolean} - true if the string is valid, false otherwise.
 */
export const validateName = (name: string): boolean =>
	createUserFormSchema.safeParse({
		firstname: name
	}).success;

/**
 * Validates a nickname.
 *
 * a valid nickname must be between 3 and 20 characters long and contain only letters and numbers.
 *
 * @param {string} name - the nickname to validate.
 * @returns {boolean} - true if the nickname is valid, false otherwise.
 */
export const validateNickName = (nickName: string): boolean =>
	createUserFormSchema.safeParse({ nickName }).success;

/**
 * Generates nicknames.
 *
 * given a first name and a last name generate a list of nicknames
 *
 * @param {string} firstName - the first name.
 * @param {string} lastName - the last name.
 * @returns {string[]} - the list of generated nicknames.
 */
export const generateNickNames = (firstName: string, lastName: string): string[] => {
	const nickNames: string[] = [];

	nickNames.push(`${firstName}.${lastName}`);
	nickNames.push(`${lastName}.${firstName}`);
	nickNames.push(`${firstName}_${lastName}`);
	nickNames.push(`${firstName}-${lastName}`);

	for (let i = 0; i < firstName.length; i++) {
		nickNames.push(`${firstName.substring(0, i)}${lastName}`);
	}

	return nickNames.map((v) => v.toLocaleLowerCase()).slice(0, 8);
};
