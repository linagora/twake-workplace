import { env } from '$env/dynamic/private';
import { error, type HandleServerError } from '@sveltejs/kit';
import { handleSession } from 'svelte-kit-cookie-session';
import logger from '$services/logger';
import { init } from '$services/ldap';

export const handle = handleSession(
	{
		secret: env.SECRET,
		key: 'twake.session',
		expires: 1
	},
	async ({ event, resolve }) => {
		try {
			await init();
		} catch (err) {
			logger.fatal('Error initializing the LDAP connection', err);
			throw error(500, 'Oops! Something went wrong. Please try again later.');
		}

		return resolve(event);
	}
);

export const handleError: HandleServerError = ({ error, event }) => {
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
		error
	);

	return {
		message: 'Internal error',
		status: 500
	};
};
