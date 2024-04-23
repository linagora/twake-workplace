import { env } from '$env/dynamic/private';
import type {
	IOtpSendPayload,
	ISmsSentResponse,
	IValidateOTPPayload,
	VerificationResult
} from '$types';
import logger from '$services/logger';

/**
 * Sends an OTP to the given phone number.
 *
 * @param {string} to - the phone number to send the message to.
 * @param {string} text - the text to send.
 */
export const send = async (to: string, text?: string): Promise<string> => {
	try {
		if (!env.SMS_SERVICE_API) {
			logger.fatal('SMS_SERVICE_API is not set');

			throw new Error('SMS_SERVICE_API is not set');
		}

		const API_ENDPOINT = `${env.SMS_SERVICE_API}/service/otp/generate`;

		const payload: IOtpSendPayload = {
			channel: 'sms',
			code_length: 6,
			phone_number: to,
			sender: 'Twake',
			text: text ?? 'Your verification code: '
		};

		const response = await fetch(API_ENDPOINT, {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'Content-Type': 'application/json',
				'api-login': env.SMS_SERVICE_LOGIN,
				'api-key': env.SMS_SERVICE_KEY
			}
		});

		const json = (await response.json()) as ISmsSentResponse;

		if (!json.otp_request_token) {
			logger.error(`invalid reponse: otp_request_token not found`, json);
			throw Error('invalid otp_request_token', { cause: json });
		}

		return json.otp_request_token;
	} catch (error) {
		logger.error(`Failed to send OTP`, { service: 'OTP', error });

		throw Error('Failed to send OTP');
	}
};

/**
 * Verifies an OTP.
 *
 * @param {string} phone - the phone number to verify.
 * @param {string} code - the code to verify.
 * @param {string} otp_request_token - the OTP request token.
 * @returns {Promise<boolean>} - whether the OTP was verified.
 */
export const verify = async (
	phone: string,
	code: string,
	otp_request_token: string
): Promise<VerificationResult> => {
	try {
		const API_ENDPOINT = `${env.SMS_SERVICE_API}/service/otp/validate`;

		if (!API_ENDPOINT) {
			logger.fatal('SMS_SERVICE_API is not set');

			throw new Error('SMS_SERVICE_API is not set');
		}

		const payload: IValidateOTPPayload = {
			code,
			otp_request_token,
			phone_number: phone
		};

		const response = await fetch(API_ENDPOINT, {
			method: 'PUT',
			body: JSON.stringify(payload),
			headers: {
				'Content-Type': 'application/json',
				'api-login': env.SMS_SERVICE_LOGIN,
				'api-key': env.SMS_SERVICE_KEY
			}
		});

		const json = await response.json();

		if (json.message === 'success' && json.code === 0) {
			return 'correct';
		}

		if (json.code === 199 || json.message === 'Wrong OTP code.') {
			logger.warn('Failed to verify OTP: wrong code', json);

			return 'wrong';
		}

		if (json.code === 198) {
			logger.error('Failed to verify OTP: timeout', json);

			throw Error('OTP Request not found');
		}

		logger.error('OTP verification timeout: Too many wrong attempts or Request timeout', json);

		return 'timeout';
	} catch (error) {
		logger.error(`Failed to verify OTP`, { service: 'OTP', error });

		throw Error('Failed to verify OTP');
	}
};

/**
 * Send recovery OTP
 *
 * @param {string} to - the phone number to send the message to.
 */
export const sendRecoveryOtp = async (to: string): Promise<string> => {
	try {
		return await send(to, 'Your recovery code is: ');
	} catch (err) {
		logger.error('Error sending recovery OTP', { service: 'OTP', err });

		throw Error('Failed to send recovery OTP');
	}
};
