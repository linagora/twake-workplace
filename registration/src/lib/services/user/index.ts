import { env } from '$env/dynamic/public';
import { generateNickNames } from '$lib/utils/username';
import type { User } from '$types';
import ldapClient from '$services/ldap';
import validator from 'validator';
import logger from '$services/logger';

/**
 * Checks if a nickname is available.
 *
 * @param {string} nickName - the nickname to check
 * @returns {Promise<boolean>} - true if the nickname is available, false otherwise
 */
export const checkNickNameAvailability = async (nickName: string): Promise<boolean> => {
	try {
		const existingUser = await ldapClient.find('cn', nickName, ['cn']);

		if (existingUser.length === 0) {
			return true;
		}

		return false;
	} catch (error) {
		logger.error(`Failed to check nickname availability: ${nickName}`, { error });

		return false;
	}
};

/**
 * Checks if a phone is available.
 *
 * @param {string} phone - the phone to check for.
 * @returns {Promise<boolean>} - true if the phone is available, false otherwise.
 */
export const checkPhoneAvailability = async (phone: string): Promise<boolean> => {
	try {
		const existingUser = await ldapClient.find('mobile', phone, ['cn']);

		if (existingUser.length === 0) {
			return true;
		}

		return false;
	} catch (error) {
		logger.error(`Failed to check phone availability: ${phone}`, { error });

		return false;
	}
};

/**
 * Checks if an email is available.
 *
 * @param {string} email - the email to check for.
 * @returns {Promise<boolean>} - true if the email is available, false otherwise.
 */
export const checkEmailAvailability = async (email: string): Promise<boolean> => {
	try {
		const existingUser = await ldapClient.find('mail', email, ['cn']);

		if (existingUser.length === 0) {
			return true;
		}

		return false;
	} catch (error) {
		console.error('Failed to check email availability', { error });

		return false;
	}
};

/**
 * Signs up a user
 *
 * @param {string} cn - the nickname of the user.
 * @param {string} mobile - the phone of the user.
 * @param {string} password - the user password.
 * @param {string} firstName - the first name of the user.
 * @param {string} lastName - the last name of the user.
 * @param {string} mail - the email to send the recovery email to.
 */
export const signup = async (
	cn: string,
	mobile: string,
	password: string,
	firstName: string,
	lastName: string
): Promise<void> => {
	try {
		const mail = `${cn}@${env.PUBLIC_SIGNUP_EMAIL_DOMAIN}`;

		const entry: User = {
			uid: cn,
			cn,
			givenName: firstName,
			sn: lastName,
			mobile,
			userPassword: password,
			mail,
			objectclass: 'inetOrgPerson'
		};

		await ldapClient.insert<User>(`cn=${cn},ou=users`, entry);
	} catch (error) {
		logger.error('Failed to create user', { error });

		throw error;
	}
};

/**
 * Fetches a user by login.
 *
 * login can be: Email / username / phone number
 *
 * @param {string} login - the login to fetch the user by.
 * @returns {User} the fetched user.
 */
export const fetchUser = async (login: string): Promise<User | null> => {
	try {
		let filter = 'cn';

		if (validator.isEmail(login)) {
			filter = 'mail';
		}

		if (validator.isMobilePhone(login)) {
			filter = 'mobile';
		}

		const user = (await ldapClient.find(filter, login, [
			'cn',
			'sn',
			'givenName'
		])) as unknown as User[];

		return user[0] || null;
	} catch (error) {
		logger.error(`Failed to fetch the user from login: ${login}`, { error });

		return null;
	}
};

/**
 * Suggest available nicknames
 *
 * @param {string} firstName
 * @param {string} lastName
 * @returns {Promise<string[]>} - a list of suggested available nicknames.
 */
export const suggestAvailableNickNames = async (
	firstName: string,
	lastName: string
): Promise<string[]> => {
	const suggestedNickNames: string[] = [];

	const nickNames = generateNickNames(firstName, lastName);

	await Promise.all(
		nickNames.map(async (nick) => {
			try {
				if ((await checkNickNameAvailability(nick)) === true) {
					suggestedNickNames.push(nick);
				}
			} catch (error) {
				logger.error(`Failed to check nickname availability: ${nick}`, { error });
			}
		})
	);

	return suggestedNickNames.slice(0, 5);
};

/**
 * Suggest alternative avaialable nicknames
 *
 * @param {string} firstName - the first name of the user.
 * @param {string} lastName - the last name of the user.
 * @param {string} current - the current nickname of the user to exclude.
 * @returns
 */
export const suggestAlternativeAvaialableNickNames = async (
	firstName: string,
	lastName: string,
	current: string
): Promise<string[]> =>
	(await suggestAvailableNickNames(firstName, lastName)).filter((nickName) => nickName !== current);
