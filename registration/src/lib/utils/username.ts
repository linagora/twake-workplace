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
 * Checks if a nickname is valid.
 *
 * a valid username must be:
 *  - 3–30 characters long.
 *  - can contain letters (a-z), numbers (0-9), and periods (.).
 *  - username cannot contain two periods in a row.
 *  - username cannot end or start with a period.
 *
 * @param {string} nickName - the username to check.
 * @returns {boolean} - true if the username is valid, false otherwise.
 */
export const validateNickName = (nickName: string): boolean =>
	/^(?!.*\.{2,})[a-zA-Z0-9](?:[a-zA-Z0-9.]{1,28})[a-zA-Z0-9]$/g.test(nickName);

/**
 * validated the nickname using zod schema.
 *
 * @param {string} nickName - the nickname to validate.
 * @returns {boolean} - true if the nickname is valid, false otherwise.
 */
export const checkNickName = (nickName: string): boolean =>
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

	for (let i = 0; i < firstName.length; i++) {
		nickNames.push(`${firstName.substring(0, i)}${lastName}`);
	}

	return nickNames.map((v) => v.toLocaleLowerCase()).slice(0, 8);
};
