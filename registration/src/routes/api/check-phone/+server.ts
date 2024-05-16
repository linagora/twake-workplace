import { checkPhoneAvailability } from '$services/user';
import { isPhoneValid } from '$utils/phone';
import logger from '$services/logger';
import { error, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { phone } = body;

		if (!phone || !isPhoneValid(phone)) {
			logger.error('Invalid phone', { phone });

			throw error(400, 'Invalid phone');
		}

		const result = await checkPhoneAvailability(phone);

		if (!result) {
			logger.error('Phone not available', { phone });
		}

		return new Response(JSON.stringify({ available: result }), { status: 200 });
	} catch (err) {
		throw error(500, 'Failed to check phone');
	}
};
