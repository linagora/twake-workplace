import { checkNickNameAvailability } from '$services/user';
import { error, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { nickname } = body;


	if (!(await checkNickNameAvailability(nickname))) {
		throw error(400, 'Nickname already taken');
	}

	return new Response('ok', { status: 200 });
};
