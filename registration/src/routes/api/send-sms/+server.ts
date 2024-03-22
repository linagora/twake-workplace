import logger from '$src/lib/services/logger';
import { error, type RequestHandler } from '@sveltejs/kit';
import { sendSMS } from '$services/sms';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request }) => {
	try {
		if (!env.LEMON_SMS_AUTH_KEY) {
			logger.fatal('Missing LEMON_SMS_AUTH_KEY');

			throw error(500, 'Missing LEMON_SMS_AUTH_KEY');
		}

		const authKey = request.headers.get('send-sms-key');

		if (!authKey || authKey !== env.LEMON_SMS_AUTH_KEY) {
			logger.error('Invalid send sms auth key', { authKey });

			throw error(401, 'Invalid or missing auth key');
		}

		if (!request.body) {
			logger.error('Missing body');

			throw error(400, 'Missing body');
		}

		const body = (await request.json()) as {
			phone: string;
			message: string;
		};

		const { phone, message } = body;

		if (!phone || !message || !body) {
			logger.error('Missing phone or message', { phone, message });

			throw error(400, 'Missing phone or message');
		}

		logger.info('Sending SMS', { phone });

		await sendSMS(phone, message);

		return new Response('ok', { status: 200 });
	} catch (err) {
		logger.error('Failed to send SMS', err);

		throw err;
	}
};
