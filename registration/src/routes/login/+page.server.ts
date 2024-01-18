import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import authService from '$lib/services/auth';

export const load: PageServerLoad = async () => {
	throw redirect(302, authService.portal);
};
