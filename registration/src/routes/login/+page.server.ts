import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { session } }) => {
	await session.destroy();

	throw redirect(302, '/?login');
};
