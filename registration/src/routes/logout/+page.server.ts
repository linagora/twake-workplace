import type { PageServerLoad } from '../$types';
import authService from '$lib/services/auth';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	await locals.session.destroy();

	cookies.delete(authService.cookieName);

	throw redirect(302, '/');
};
