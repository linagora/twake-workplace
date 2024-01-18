import type { Actions, PageServerLoad } from './$types';
import Client from '$lib/services/ldap/client';
import { send, verify } from '$lib/services/otp';
import { type Redirect, fail, redirect } from '@sveltejs/kit';
import { isPhoneValid } from '$lib/utils/phone';
import { validatePassword } from '$lib/utils/password';
import {
	checkNickNameAvailability,
	checkPhoneAvailability,
	fetchUser,
	signup,
	suggestAlternativeAvaialableNickNames
} from '$lib/services/user';
import { validateName, validateNickName } from '$lib/utils/username';
import authService from '$lib/services/auth';
import { extractMainDomain, getOath2RedirectUri, getOidcRedirectUrl } from '$lib/utils/url';

export const load: PageServerLoad = async ({ locals, url, cookies }) => {
	await Client.getClient();

	const { session } = locals;
	const redirectUrl = url.searchParams.get('post_registered_redirect_url') ?? undefined;
	const postLoginUrl = url.searchParams.get('post_login_redirect_url') ?? undefined;
	const clientId = url.searchParams.get('client_id') ?? undefined;

	const cookie = cookies.get(authService.cookieName);

	await session.update((data) => ({
		...data,
		redirectUrl,
		postLoginUrl,
		clientId
	}));

	if (session.data.authenticated === true && cookie) {
		throw redirect(302, postLoginUrl ?? '/success');
	}

	return {
		isLogin: !!postLoginUrl
	};
};

export const actions: Actions = {
	sendOtp: async ({ request, locals }) => {
		const data = await request.formData();
		const phone = data.get('phone') as string;

		if (!(await checkPhoneAvailability(phone))) {
			return fail(400, { phone, phone_taken: true });
		}

		if (!phone) {
			return fail(400, { phone, missing: true });
		}

		if (!isPhoneValid(phone)) {
			return fail(400, { phone, invalid: true });
		}

		const { last_sent } = locals.session.data;

		if (last_sent && last_sent > Date.now() - 60000) {
			return fail(400, { phone, invalid: true });
		}

		const token = await send(phone);

		await locals.session.set({
			otp_request_token: token,
			last_sent: Date.now(),
			phone,
			verified: false,
			authenticated: false
		});

		return { sent: true };
	},

	checkOtp: async ({ request, locals }) => {
		const data = await request.formData();
		const password = data.get('password') as string;
		const { session } = locals;

		if (!session.data.phone) {
			return fail(400, { missing: true });
		}

		if (!password || !session.data.otp_request_token) {
			return fail(400, { incorrect: true });
		}

		const verification = await verify(session.data.phone, password, session.data.otp_request_token);

		if (verification === 'correct') {
			await locals.session.update((data) => ({
				...data,
				verified: true
			}));

			return { verified: true };
		} else if (verification === 'timeout') {
			await locals.session.update((data) => ({
				...data,
				verified: false
			}));

			return fail(400, { timeout: true });
		} else {
			await locals.session.update((data) => ({
				...data,
				verified: false
			}));

			return fail(400, { incorrect: true });
		}
	},

	register: async ({ request, locals, cookies, url }) => {
		try {
			const data = await request.formData();
			const { session } = locals;
			const phone = data.get('phone') as string;
			const { phone: verifiedPhone, redirectUrl = null, challenge = null, clientId = null } = session.data;

			if (!phone || isPhoneValid(phone) === false || !(await checkPhoneAvailability(phone))) {
				return fail(400, { invalid_phone: true });
			}

			if (!session.data.verified || verifiedPhone !== phone) {
				return fail(400, { invalid_phone: true });
			}

			const nickname = data.get('nickname') as string;
			const firstName = data.get('firstname') as string;
			const lastName = data.get('lastname') as string;
			const password = data.get('password') as string;

			if (!password || !validatePassword(password)) {
				return fail(400, { invalid_password: true });
			}

			if (validateNickName(nickname) === false) {
				return fail(400, { invalid_nickname: true });
			}

			if ((await checkNickNameAvailability(nickname)) === false) {
				const alternatives = await suggestAlternativeAvaialableNickNames(
					firstName,
					lastName,
					nickname
				);

				return fail(400, { nickname_taken: true, alternative_nicknames: alternatives });
			}

			if (validateName(firstName) === false) {
				return fail(400, { invalid_firstname: true });
			}

			if (validateName(lastName) === false) {
				return fail(400, { invalid_lastname: true });
			}

			await signup(nickname, phone, password, firstName, lastName);

			await locals.session.set({
				authenticated: true,
				otp_request_token: null,
				last_sent: null,
				phone,
				verified: false,
				user: nickname,
				firstName,
				lastName
			});

			const authSessionCookie = await authService.login(nickname, password);

			cookies.set(authService.cookieName, authSessionCookie, {
				domain: extractMainDomain(url.host)
			});

			const destinationUrl = redirectUrl
				? challenge && clientId
					? getOath2RedirectUri(challenge, redirectUrl, clientId)
					: getOidcRedirectUrl(redirectUrl)
				: '/success';

			throw redirect(302, destinationUrl);
		} catch (err) {
			if ((err as Redirect).location) {
				throw err;
			}

			console.error({ err });

			return fail(500, { error: true });
		}
	},

	login: async ({ request, locals, cookies, url }) => {
		try {
			const data = await request.formData();

			const login = data.get('login') as string;
			const password = data.get('password') as string;

			const { postLoginUrl = null, challenge = null, clientId = null } = locals.session.data;

			const cookie = await authService.login(login, password);

			if (!cookie) {
				return fail(400, { failed_login: true });
			}

			const user = await fetchUser(login);

			if (!user) {
				throw Error('User not found');
			}

			await locals.session.update((data) => ({
				...data,
				authenticated: true,
				lastName: user?.sn,
				firstName: user?.givenName,
				user: user?.cn
			}));

			cookies.set(authService.cookieName, cookie, { domain: extractMainDomain(url.host) });

			const destinationUrl = postLoginUrl
				? challenge && clientId
					? getOath2RedirectUri(challenge, postLoginUrl, clientId)
					: getOidcRedirectUrl(postLoginUrl)
				: '/success';

			throw redirect(302, destinationUrl);
		} catch (err) {
			if ((err as Redirect).location) {
				throw err;
			}

			return fail(500, { failed_login: true });
		}
	}
};
