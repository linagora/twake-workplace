import { send } from '$lib/services/otp';
import { checkPhoneAvailability } from '$lib/services/user';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isPhoneValid } from '$lib/utils/phone';

export const POST: RequestHandler = async ({ request, locals }) => {
	const body = await request.json();
	const { phone } = body;

	if (!isPhoneValid(phone)) {
		throw error(400, 'Invalid phone number');
	}

	if (locals.session.data.last_sent && locals.session.data.last_sent > Date.now() - 60000) {
		throw error(429, 'Too many requests');
	}

	if (!(await checkPhoneAvailability(phone))) {
		throw error(400, 'Phone number is already in use');
	}

	const token = await send(phone);

	await locals.session.set({
		otp_request_token: token,
		phone,
		last_sent: Date.now(),
		verified: false,
		authenticated: false
	});

	return new Response('ok', { status: 200 });
};
