import logger from '$services/logger';
import { checkPhoneAvailability, getUserByPhone, updateUserPassword } from '$services/user';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { sendRecoveryOtp, verify } from '$services/otp';
import { isPhoneValid } from '$utils/phone';
import { validatePassword } from '$src/lib/utils/password';

export const load = (async ({ locals: { session } }) => {
	return {
		phone: session.data.recovery_phone,
		verified: session.data.verified_recovery_phone
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	sendRecoveryOTP: async ({ request, locals: { session } }) => {
		const data = Object.fromEntries(await request.formData()) as {
			phone: string;
		};

		try {
			const { phone } = data;

			if (!isPhoneValid(phone)) {
				logger.warn('invalid phone', phone);

				return fail(400, { phone, invalid_phone: true });
			}

			if (await checkPhoneAvailability(phone)) {
				logger.error("Phone doesn't exist", phone);

				return fail(400, { phone, phone_not_found: true });
			}

			const { last_sent } = session.data;

			if (last_sent && last_sent > Date.now() - 60000) {
				logger.warn('rate limit reached');

				return fail(400, { phone, rate_limit: true });
			}

			const token = await sendRecoveryOtp(phone);

			await session.update((data) => ({
				...data,
				recovery_otp_request_token: token,
				last_sent: Date.now(),
				verified_recovery_phone: false
			}));

			return { sent: true };
		} catch (err) {
			logger.error('Failed to send recovery OTP', err);

			return fail(500, { message: 'Failed to send recovery OTP', recovery_send_failed: true });
		}
	},
	verifyRecoveryOTP: async ({ request, locals: { session } }) => {
		const data = Object.fromEntries(await request.formData()) as {
			password: string;
		};

		try {
			if (!session.data.recovery_phone) {
				logger.warn('missing recovery phone, resetting session');

				return fail(400, { missing_recovery_phone: true });
			}

			if (!session.data.recovery_otp_request_token) {
				logger.warn('missing recovery OTP token, resetting session');

				return fail(400, { missing_recovery_otp_token: true });
			}

			const { password } = data;
			const { recovery_otp_request_token, recovery_phone } = session.data;

			const verification = await verify(recovery_phone, password, recovery_otp_request_token);

			if (verification === 'correct') {
				await session.update((data) => ({
					...data,
					verified_recovery_phone: true
				}));

				return { verified_recovery: true };
			}

			logger.info(`incorrect recovery OTP for phone: ${recovery_phone}`, verification);

			await session.update((data) => ({
				...data,
				verified_recovery_phone: false
			}));

			return fail(400, {
				...(verification === 'timeout' && { timeout: true }),
				...(verification === 'wrong' && { incorrect_recovery: true })
			});
		} catch (err) {
			logger.error('Failed to verify recovery OTP', err);

			return fail(500, { message: 'Failed to verify recovery OTP', recovery_verify_failed: true });
		}
	},
	resetPassword: async ({ request, locals: { session } }) => {
		const data = Object.fromEntries(await request.formData()) as {
			password: string;
		};

		try {
			if (!session.data.recovery_phone) {
				logger.warn('missing recovery phone, resetting session');

				return fail(400, { missing_recovery_phone: true });
			}

			if (!session.data.verified_recovery_phone) {
				logger.warn('missing verified recovery phone, resetting session');

				return fail(400, { missing_verified_recovery_phone: true });
			}

			const { password } = data;
			const { recovery_phone } = session.data;

			if (!validatePassword(password)) {
				logger.warn('invalid password', password);

				return fail(400, { invalid_password: true });
			}

			const user = await getUserByPhone(recovery_phone);

			if (!user) {
				logger.error('Cannot fetch user using provided phone', recovery_phone);

				throw Error('User not found');
			}

			await updateUserPassword(user.cn, password);

			return { success: true };
		} catch (err) {
			logger.error('Failed to reset password', err);

			return fail(500, { message: 'Failed to reset password', password_reset_failed: true });
		}
	}
};
