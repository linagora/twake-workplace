import { suggestAvailableNickNames } from '$lib/services/user';
import { validateName } from '$lib/utils/username';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { firstname, lastname } = body;

	if (!firstname || !lastname) {
		throw error(400, 'missing firstname or lastname');
	}

	if(!validateName(firstname) || !validateName(lastname)) {
		throw error(400, 'Invalid name');
	}

	try {
		const nicknames = await suggestAvailableNickNames(firstname, lastname);

		return json(nicknames);
	} catch (err) {
		throw error(500, 'Failed to suggest nickname');
	}
};
