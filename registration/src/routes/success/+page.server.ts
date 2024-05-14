import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import authService from '$services/auth';
import { fetchUser } from '$services/user';
import logger from '$services/logger';

export const load: PageServerLoad = async ({ parent, cookies }) => {
	const { session } = await parent();

	const cookie = cookies.get(authService.cookieName);

	if (!cookie) {
		throw redirect(302, '/');
	}

	let { nickname: username, firstName, lastName, phone } = session;
	let email: string | undefined;

	if (!username) {
		const lemonldapSessionUser = await authService.fetchUser(cookie);
		username = lemonldapSessionUser;

		if (!lemonldapSessionUser) {
			logger.error('Invalid lemonldap session');

			throw redirect(302, '/');
		}

		try {
			const user = await fetchUser(lemonldapSessionUser);

			if (!user) {
				throw new Error('User not found in LDAP');
			}

			firstName = user.sn[0];
			lastName = user.givenName[0];
			phone = user.mobile[0];
			email = user.mail?.[0];
		} catch (error) {
			logger.warn('Failed to fetch user from LDAP', error);
		}
	}

	return {
		username,
		firstName,
		lastName,
		phone,
		email,
		redirectUrl: session.redirectUrl ?? null,
		challenge: session.challenge ?? null,
		clientId: session.clientId ?? null
	};
};
