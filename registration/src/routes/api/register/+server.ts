import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { validatePassword } from '$lib/utils/password';
import { checkNickNameAvailability, checkPhoneAvailability, signup } from '$lib/services/user';
import authService from '$lib/services/auth';
import { validateName, validateNickName } from '$lib/utils/username';
import { extractMainDomain } from '$lib/utils/url';

export const POST: RequestHandler = async ({ request, locals, cookies, url }) => {
	const { nickname, phone, firstname, lastname, password } = await request.json();

	const { phone: verifiedPhone, verified } = locals.session.data;

	if (!phone || !verified || verifiedPhone !== phone) {
		throw error(401, 'Unauthorized: phone is not verified');
	}

	if (!nickname || !password || !firstname || !lastname) {
		throw error(400, 'Bad Request: missing fields');
	}

	if (!validateName(firstname) || !validateName(lastname)) {
		throw error(400, 'Bad Request: invalid name');
	}

	if (!validateNickName(nickname)) {
		throw error(400, 'Bad Request: invalid nickname');
	}

	if (!password || !validatePassword(password)) {
		throw error(400, 'Bad Request: invalid password');
	}

	if (!(await checkNickNameAvailability(nickname))) {
		throw error(400, 'Bad Request: nickname is not available');
	}

	if (!(await checkPhoneAvailability(phone))) {
		throw error(400, 'Bad Request: phone is not available');
	}

	await signup(nickname, phone, password, firstname, lastname);

	await locals.session.set({
		authenticated: true,
		user: nickname,
		otp_request_token: null,
		phone: null,
		verified: false,
		firstName: firstname,
		lastName: lastname,
		last_sent: null
	});

	const authSessionCookie = await authService.login(nickname, password);

	cookies.set(authService.cookieName, authSessionCookie, { domain: extractMainDomain(url.host) });

	return new Response('ok', { status: 201 });
};
