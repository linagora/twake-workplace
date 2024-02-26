import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import authService from '$lib/services/auth';
import logger from '$services/logger';

export const load: PageServerLoad = async ({ parent, cookies }) => {
	const { session } = await parent();

	const cookie = cookies.get(authService.cookieName);

	if (!session.authenticated || !cookie) {
		logger.info('User not authenticated, redirecting to main page');

		throw redirect(302, '/');
	}

	return {
		username: session.nickname,
		firstName: session.firstName,
		lastName: session.lastName,
		phone: session.phone,
		redirectUrl: session.redirectUrl ?? null,
		challenge: session.challenge ?? null,
		clientId: session.clientId ?? null
	};
};
