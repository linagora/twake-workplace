import { env } from '$env/dynamic/private';
import type { HandleServerError } from '@sveltejs/kit';
import { handleSession } from 'svelte-kit-cookie-session';
import logger from '$services/logger';

export const handle = handleSession({
	secret: env.SECRET,
	key: 'twake.session',
	expires: 1
});

export const handleError: HandleServerError = ({ error, event }) => {
	const client = event.getClientAddress();
	const { referrer, method, url } = event.request;

	logger.error(
		'Server error',
		{
			url,
			client,
			method,
			referrer,
			userAgent: event.request.headers.get('user-agent') || 'Unknown'
		},
		error
	);

	return {
		message: 'Internal error',
		status: 500
	};
};
