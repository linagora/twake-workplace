import { checkPhoneAvailability } from '$lib/services/user';
import { isPhoneValid } from '$lib/utils/phone';
import { error, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { phone } = body;

		if (!phone || !isPhoneValid(phone)) {
			throw error(400, 'Invalid phone');
		}

		const result = await checkPhoneAvailability(phone);

		return new Response(JSON.stringify({ available: result }), { status: 200 });
	} catch (err) {
		throw error(500, 'Failed to check phone');
	}
};
