import { env } from '$env/dynamic/public';
import { generateNickNames } from '$utils/username';
import type { LDAPChangePayload, User } from '$types';
import ldapClient from '$services/ldap';
import validator from 'validator';
import logger from '$services/logger';
import { isPhoneValid } from '$utils/phone';
import ldap from 'ldapjs';

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
		logger.error(`Failed to check nickname availability`, { serivce: 'USER', error });

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
		logger.error(`Failed to check phone availability`, { serivce: 'USER', error });

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
		console.error('Failed to check email availability', { serivce: 'USER', error });

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
		logger.error('[LDAP] Failed to insert new user in LDAP', { serivce: 'USER', error });

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
			'givenName',
			'mobile',
      'mail'
		])) as unknown as User[];

		return user[0] || null;
	} catch (error) {
		logger.error(`[LDAP] Failed to fetch the user from LDAP using login: ${login}`, { error });

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
	try {
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
	} catch (error) {
		logger.error(`Failed to suggest available nicknames`, { service: 'USER', error });

		return suggestedNickNames;
	}
};

/**
 * Suggest alternative avaialable nicknames
 *
 * @param {string} firstName - the first name of the user.
 * @param {string} lastName - the last name of the user.
 * @param {string} current - the current nickname of the user to exclude.
 * @returns {Promise<string[]>} - a list of suggested alternative available nicknames.
 */
export const suggestAlternativeAvaialableNickNames = async (
	firstName: string,
	lastName: string,
	current: string
): Promise<string[]> =>
	(await suggestAvailableNickNames(firstName, lastName)).filter((nickName) => nickName !== current);

/**
 * Update user password
 *
 * @param {string} username - the nickname of the user.
 * @param {string} password - the new password.
 */
export const updateUserPassword = async (username: string, password: string): Promise<void> => {
	try {
		const passwordAttribute = new ldap.Attribute({
			type: 'userPassword',
			vals: password
		});

		const payload = new ldap.Change({
			operation: 'replace',
			modification: passwordAttribute
		} satisfies LDAPChangePayload);

		await ldapClient.update(`cn=${username},ou=users`, payload);
	} catch (error) {
		logger.error(`[LDAP] Failed to update user password in LDAP`, { service: 'USER', error });

		throw error;
	}
};

/**
 * Get user using phone number
 *
 * @param {string} phone - the phone number of the user.
 * @returns {Promise<User | null>} - the user.
 */
export const getUserByPhone = async (phone: string): Promise<User | null> => {
	try {
		if (!isPhoneValid(phone)) {
			throw new Error('Invalid phone number');
		}

		return fetchUser(phone);
	} catch (error) {
		logger.error(`[LDAP] Failed to get user by phone from LDAP`, { service: 'USER', error });

		return null;
	}
};
