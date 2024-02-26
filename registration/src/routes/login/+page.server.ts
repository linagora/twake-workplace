import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import authService from '$lib/services/auth';
import logger from '$services/logger';

export const load: PageServerLoad = async () => {
	logger.info('Redirecting to authentication portal');

	throw redirect(302, authService.portal);
};
