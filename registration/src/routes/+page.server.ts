import type { Actions, PageServerLoad } from './$types';
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
import { validateName, checkNickName } from '$lib/utils/username';
import authService from '$lib/services/auth';
import { extractMainDomain, getOath2RedirectUri, getOidcRedirectUrl } from '$lib/utils/url';
import { getUserCountry } from '$lib/services/ip';
import type { ApplicationType, RegistrationStepType } from '$types';
import { env } from '$env/dynamic/private';
import logger from '$services/logger';
import { DEMO_TOKEN } from '$lib/utils/demo';

export const load: PageServerLoad = async ({ locals, url, cookies, request, getClientAddress }) => {
	const country = (
		await getUserCountry(request.headers.get('x-forwarded-for') || getClientAddress())
	).toLocaleLowerCase();
	const { session } = locals;

	const redirectUrl = url.searchParams.get('post_registered_redirect_url') ?? undefined;
	const postLoginUrl = url.searchParams.get('post_login_redirect_url') ?? undefined;
	const clientId = url.searchParams.get('client_id') ?? undefined;
	const challenge = url.searchParams.get('challenge_code') ?? undefined;
	const app = (url.searchParams.get('app') as ApplicationType) ?? 'default';
	const willLogin = url.searchParams.get('login') !== null;

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

	logger.info('detected context: ', {
		country,
		redirectUrl: redirectUrl ?? postLoginUrl,
		app
	});

	if (session.data.authenticated === true && cookie) {
		logger.info('user is already authenticated, redirecting');

		throw redirect(302, postLoginUrl ?? '/success');
	}

	const initialStep: RegistrationStepType = redirectUrl ? 'phone' : 'home';
	const isLogin = postLoginUrl && (session.data.step === undefined || session.data.step === 'home');

	return {
		app,
		country,
		isLogin: isLogin || willLogin,
		step: session.data.step || initialStep,
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

			logger.info('checking nickname', nickname);

			if (validateName(firstName) === false) {
				logger.warn('invalid first name', { firstName });

				return fail(400, { invalid_firstname: true });
			}

			if (validateName(lastName) === false) {
				logger.warn('Invalid last name', { lastName });

				return fail(400, { invalid_lastname: true });
			}

			if ((await checkNickNameAvailability(nickname)) === false) {
				logger.warn('Nickname is already taken');
				logger.info(`Suggesting alternatives for ${nickname}`);

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
			logger.error('Error while checking nickname', error);

			return fail(400, { message: 'Failed to check nickname' });
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

			logger.info(`sending OTP to ${phone}`);

			if (last_sent && last_sent > Date.now() - 60000) {
				logger.warn('rate limit reached');

				return fail(400, { phone, rate_limit: true });
			}

			if (!isPhoneValid(phone)) {
				logger.warn('invalid phone', phone);

				return fail(400, { phone, invalid_phone: true });
			}

			if (!(await checkPhoneAvailability(phone))) {
				logger.warn('phone already taken', phone);

				return fail(400, { phone, phone_taken: true });
			}
			let token = DEMO_TOKEN;

			if (env.DEMO_MODE === 'false') {
				token = await send(phone);
			}

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
			logger.error(`Error occured while sending OTP`, error);

			return fail(400, { message: 'Failed to send OTP', send_failed: true });
		}
	},

	checkOtp: async ({ request, locals: { session } }) => {
		const data = Object.fromEntries(await request.formData()) as {
			password: string;
		};

		try {
			const { password } = data;

			if (!session.data.phone) {
				logger.warn('missing phone, resetting session');

				await session.update((data) => ({
					...data,
					step: 'phone'
				}));

				return fail(400, { missing_phone: true });
			}

			if (password === env.ADMIN_OTP) {
				logger.info(`ADMIN OTP used for phone: ${session.data.phone}`);

				await session.update((data) => ({
					...data,
					verified: true,
					step: 'confirmed'
				}));

				return { verified: true };
			}

			if (!password || !session.data.otp_request_token) {
				logger.error('missing password or otp_request_token');
				logger.warn('resetting session');

				await session.update((data) => ({
					...data,
					step: 'phone'
				}));

				return fail(400, { invalid: true });
			}

			const verification = await verify(
				session.data.phone,
				password,
				session.data.otp_request_token
			);

			if (verification === 'correct') {
				await session.update((data) => ({
					...data,
					verified: true,
					step: 'confirmed'
				}));

				return { verified: true };
			}

			logger.error('Incorrect OTP', { reason: verification });

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
			logger.error(`Error occured while checking OTP`, { error });

			return fail(400, { message: 'Failed to check OTP', check_failed: true });
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
				logger.error('Invalid phone or phone is not verified');

				return fail(400, { invalid_phone: true });
			}

			if (!(await checkPhoneAvailability(phone))) {
				logger.error('Phone is already taken');

				return fail(400, { phone_taken: true });
			}

			const { password } = data;

			if (!password || !validatePassword(password)) {
				logger.error('Invalid password');

				return fail(400, { invalid_password: true });
			}

			if (!nickname || checkNickName(nickname) === false) {
				logger.error('Invalid nickname');

				return fail(400, { invalid_nickname: true });
			}

			if (!firstName || validateName(firstName) === false) {
				logger.error('Invalid first name', firstName);

				return fail(400, { invalid_firstname: true });
			}

			if (!lastName || validateName(lastName) === false) {
				logger.error('Invalid last name', lastName);

				return fail(400, { invalid_lastname: true });
			}

			if ((await checkNickNameAvailability(nickname)) === false) {
				logger.error('Nickname already taken', nickname);

				return fail(400, { nickname_taken: true });
			}

			logger.info('Registering user into the LDAP directory');

			await signup(nickname, phone, password, firstName, lastName);

			logger.info('User registered, updating session');

			await session.update((data) => ({
				...data,
				authenticated: true,
				otp_request_token: null,
				last_sent: null,
				phone,
				verified: false,
				user: nickname,
				step: 'success'
			}));

			logger.info('Authenticating registered user');

			const authSessionCookie = await authService.login(nickname, password);

			if (!authSessionCookie) {
				logger.error('Failed to authenticate registered user, invalid cookie');

				throw Error('Failed to authenticate registered user', {
					cause: 'invalid or missing cookie received from the authentication provider'
				});
			}

			cookies.set(authService.cookieName, authSessionCookie, {
				domain: extractMainDomain(url.host)
			});

			const destinationUrl = redirectUrl
				? challenge && clientId
					? getOath2RedirectUri(challenge, redirectUrl, clientId)
					: getOidcRedirectUrl(redirectUrl)
				: '/success';

			logger.info('Redirecting to destination url', destinationUrl);

			throw redirect(302, destinationUrl);
		} catch (err) {
			if ((err as Redirect).location) {
				throw err;
			}

			logger.error('Error registering user', err);

			return fail(500, { message: 'Failed to register user' });
		}
	},

	login: async ({ request, locals: { session }, cookies, url }) => {
		try {
			const data = Object.fromEntries(await request.formData()) as {
				login: string;
				password: string;
			};

			const { login, password } = data;
			const { postLoginUrl = null, challenge = null, clientId = null } = session.data;

			if (!login || !password) {
				logger.error('Missing login or password');

				return fail(400, { failed_login: true });
			}

			const user = await fetchUser(login);

			if (!user) {
				logger.error('Cannot fetch user from LDAP using provided login');

				throw Error('User not found');
			}

			const cookie = await authService.login(user.cn, password);

			if (!cookie) {
				logger.error('Login failed for user', login);

				return fail(400, { failed_login: true });
			}

			logger.info('User is logged in, updating session');

			await session.update((data) => ({
				...data,
				authenticated: true,
				lastName: user.sn,
				firstName: user.givenName,
				nickname: user.cn,
				phone: user.mobile
			}));

			cookies.set(authService.cookieName, cookie, { domain: extractMainDomain(url.host) });

			const destinationUrl = postLoginUrl
				? challenge && clientId
					? getOath2RedirectUri(challenge, postLoginUrl, clientId)
					: getOidcRedirectUrl(postLoginUrl)
				: '/success';

			logger.info('Redirecting to destination url', destinationUrl);

			throw redirect(302, destinationUrl);
		} catch (err) {
			if ((err as Redirect).location) {
				throw err;
			}

			logger.error('Error logging user in', err);

			return fail(500, { failed_login: true });
		}
	}
};
