import { env } from '$env/dynamic/private';
import logger from '$services/logger';
import type { SendSMSPayload } from '$src/types';

export const sendSMS = async (phone: string, message: string) => {
	try {
		if (!env.SMS_SERVICE_API) {
			logger.fatal('SMS_SERVICE_API is not set');

			throw new Error('SMS_SERVICE_API is not set');
		}

		const API_ENDPOINT = `${env.SMS_SERVICE_API}/sms-campaign/send`;

		const payload: SendSMSPayload = {
			text: message,
			sender: 'Twake',
			recipients: [
				{
					phone_number: phone
				}
			]
		};

		logger.info(`Sending SMS to ${phone}`);

		const response = await fetch(API_ENDPOINT, {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'Content-Type': 'application/json',
				'api-login': env.SMS_SERVICE_LOGIN,
				'api-key': env.SMS_SERVICE_KEY
			}
		});

		const responseBody = await response.json();

		if (response.status !== 201 && response.status !== 200) {
			throw Error('Failed to send SMS', { cause: responseBody.message });
		}
	} catch (error) {
		logger.fatal(`Failed to send SMS to ${phone}`, error);

		throw Error('Failed to send SMS', { cause: error });
	}
};
