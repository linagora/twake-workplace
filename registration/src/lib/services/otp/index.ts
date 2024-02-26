import { env } from '$env/dynamic/private';
import type {
	ISmsSendPayload,
	ISmsSentResponse,
	IValidateOTPPayload,
	VerificationResult
} from '$types';
import logger from '$services/logger';

/**
 * Sends an OTP to the given phone number.
 *
 * @param {string} to - the phone number to send the message to.
 */
export const send = async (to: string): Promise<string> => {
	try {
		const API_ENDPOINT = `${env.SMS_SERVICE_API}/generate`;

		if (!API_ENDPOINT) {
			logger.fatal('SMS_SERVICE_API is not set');

			throw new Error('SMS_SERVICE_API is not set');
		}

		const payload: ISmsSendPayload = {
			channel: 'sms',
			code_length: 6,
			phone_number: to,
			sender: 'Twake',
			text: 'Your verification code: '
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
			throw Error('Failed to send OTP');
		}

		return json.otp_request_token;
	} catch (error) {
		logger.error(`Failed to send OTP to ${to}`, error);

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
		const API_ENDPOINT = `${env.SMS_SERVICE_API}/validate`;

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
			return 'wrong';
		}

		return 'timeout';
	} catch (error) {
		logger.error(`Failed to verify OTP for ${phone}`, error);

		throw Error('Failed to verify OTP');
	}
};
