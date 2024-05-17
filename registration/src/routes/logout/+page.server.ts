import type { PageServerLoad } from './$types';
import authService from '$services/auth';
import { redirect } from '@sveltejs/kit';
import logger from '$services/logger';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	logger.info('Logging out', { user: locals.session.data?.nickname ?? '' });

	await locals.session.destroy();
	const cookie = cookies.get(authService.cookieName);

	if (cookie) {
		await authService.logout(cookie);

		cookies.delete(authService.cookieName);
	}

	throw redirect(302, '/?login');
};
