import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verify } from '$lib/services/otp';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { password } = await request.json();
	const { data } = locals.session;

	if (!data.otp_request_token || !password || !data.phone) {
		throw error(400, 'Malformed request');
	}

	const verification = await verify(data.phone, data.otp_request_token, password);

	if (verification === 'wrong') {
		throw error(401, 'Incorrect password');
	}

	if (verification === 'timeout') {
		throw error(400, 'Maximum amount of wrong attempts has been reached');
	}

	await locals.session.set({
		...data,
		verified: true
	});

	return new Response('ok', { status: 200 });
};
