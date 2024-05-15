import type { HandleServerError } from '@sveltejs/kit';
import logger from '$services/logger';

export const errorHandler = (({ error, event }) => {
	const client = event.getClientAddress();
	const { referrer, method, url } = event.request;

	logger.fatal(
		'Server error',
		{
			url,
			client,
			method,
			referrer,
			userAgent: event.request.headers.get('user-agent') || 'Unknown'
		},
		{ error }
	);

	return {
		message: 'Internal error',
		status: 500
	};
}) satisfies HandleServerError;
