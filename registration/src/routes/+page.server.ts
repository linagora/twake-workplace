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
import { getUserCountry } from '$lib/services/ip';
import type { ApplicationType, VerificationResult } from '../types';

export const load: PageServerLoad = async ({ locals, url, cookies, getClientAddress }) => {
	await Client.getClient();

	const country = await getUserCountry(getClientAddress());
	const { session } = locals;

	const redirectUrl = url.searchParams.get('post_registered_redirect_url') ?? undefined;
	const postLoginUrl = url.searchParams.get('post_login_redirect_url') ?? undefined;
	const clientId = url.searchParams.get('client_id') ?? undefined;
	const challenge = url.searchParams.get('challenge_code') ?? undefined;
	const app = (url.searchParams.get('app') as ApplicationType) ?? 'default';

	const cookie = cookies.get(authService.cookieName);

	await session.update((data) => ({
		...data,
		redirectUrl,
		postLoginUrl,
		clientId,
		country,
		challenge,
		app
	}));

	if (session.data.authenticated === true && cookie) {
		throw redirect(302, postLoginUrl ?? '/success');
	}

	return {
		app: 'chat',
		country,
		isLogin: !!postLoginUrl,
		step: session.data.step,
		verified: session.data.verified,
		phone: session.data.phone
	};
};

export const actions: Actions = {
	checkNickName: async ({ request, locals: { session } }) => {
		const data = Object.fromEntries(await request.formData()) as {
			nickname: string;
			firstName: string;
			lastName: string;
		};

		try {
			const { firstName, lastName, nickname } = data;

			if (validateName(firstName) === false) {
				return fail(400, { invalid_firstname: true });
			}

			if (validateName(lastName) === false) {
				return fail(400, { invalid_lastname: true });
			}

			if ((await checkNickNameAvailability(nickname)) === false) {
				const alternatives = await suggestAlternativeAvaialableNickNames(
					firstName,
					lastName,
					nickname
				);

				return fail(400, { nickname_taken: true, alternative_nicknames: alternatives });
			}

			await session.update((data) => ({
				...data,
				step: 'password',
				firstName,
				lastName,
				nickname
			}));

			return { success: true };
		} catch (error) {
			return fail(400, { error });
		}
	},

	sendOtp: async ({ request, locals: { session } }) => {
		const data = Object.fromEntries(await request.formData()) as {
			phone: string;
		};

		try {
			await session.update((data) => ({
				...data,
				step: 'phone'
			}));

			const { phone } = data;
			const { last_sent } = session.data;

			if (last_sent && last_sent > Date.now() - 60000) {
				return fail(400, { phone, rate_limit: true });
			}

			if (!isPhoneValid(phone)) {
				return fail(400, { phone, invalid_phone: true });
			}

			if (!(await checkPhoneAvailability(phone))) {
				return fail(400, { phone, phone_taken: true });
			}

			const token = '123456';

			await session.set({
				otp_request_token: token,
				last_sent: Date.now(),
				phone,
				verified: false,
				authenticated: false,
				step: 'otp'
			});

			return { sent: true };
		} catch (error) {
			fail(400, { error });
		}
	},

	checkOtp: async ({ request, locals: { session } }) => {
		const data = Object.fromEntries(await request.formData()) as {
			password: string;
		};

		try {
			const { password } = data;

			if (!session.data.phone) {
				return fail(400, { missing_phone: true });
			}

			if (!password || !session.data.otp_request_token) {
				return fail(400, { invalid: true });
			}

			// const verification = await verify(
			// 	session.data.phone,
			// 	password,
			// 	session.data.otp_request_token
			// );

			const verification: VerificationResult = 'correct';

			if (verification === 'correct') {
				await session.update((data) => ({
					...data,
					verified: true,
					step: 'confirmed'
				}));

				return { verified: true };
			}

			await session.update((data) => ({
				...data,
				verified: false,
				step: 'otp'
			}));

			return fail(400, {
				...(verification === 'timeout' && { timeout: true }),
				...(verification === 'wrong' && { incorrect: true })
			});
		} catch (error) {
			return fail(400, { error });
		}
	},

	register: async ({ request, locals: { session }, cookies, url }) => {
		const data = Object.fromEntries(await request.formData()) as {
			password: string;
		};

		try {
			const {
				phone,
				redirectUrl = null,
				challenge = null,
				clientId = null,
				nickname,
				firstName,
				lastName,
				verified
			} = session.data;

			if (!phone || !isPhoneValid(phone) || !verified) {
				return fail(400, { invalid_phone: true });
			}

			if (!(await checkPhoneAvailability(phone))) {
				return fail(400, { phone_taken: true });
			}

			const { password } = data;

			if (!password || !validatePassword(password)) {
				return fail(400, { invalid_password: true });
			}

			if (!nickname || validateNickName(nickname) === false) {
				return fail(400, { invalid_nickname: true });
			}

			if (!firstName || validateName(firstName) === false) {
				return fail(400, { invalid_firstname: true });
			}

			if (!lastName || validateName(lastName) === false) {
				return fail(400, { invalid_lastname: true });
			}

			if ((await checkNickNameAvailability(nickname)) === false) {
				return fail(400, { nickname_taken: true });
			}

			await signup(nickname, phone, password, firstName, lastName);

			await session.set({
				authenticated: true,
				otp_request_token: null,
				last_sent: null,
				phone,
				verified: false,
				user: nickname,
				step: 'success'
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
