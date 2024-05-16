import type { HandleServerError } from '@sveltejs/kit';
import logger from '$services/logger';

export const errorHandler = (({ error, event }) => {
	const client = event.getClientAddress();
	const { referrer, method, url, headers } = event.request;
	const typedError = error as Error & { status?: number };

	if (typedError?.status === 404) {
		logger.warn('Not found', { url });

		return { message: 'Not found', status: 404 };
	}

	if (typedError.status && typedError.status >= 400 && typedError.status < 500) {
		logger.warn('Bad Request', { url });

		return { message: 'Bad Request', status: typedError.status };
	}

	logger.fatal(
		'Server error',
		{ url, client, method, referrer, userAgent: headers.get('user-agent') || 'Unknown' },
		{ error }
	);

	return {
		message: 'Internal error',
		status: 500
	};
}) satisfies HandleServerError;
