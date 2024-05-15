import { env } from '$env/dynamic/private';
import { handleSession } from 'svelte-kit-cookie-session';
import { errorHandler } from '$utils/error';
import { ldapConnectionHandler } from '$utils/db';

export const handle = handleSession(
	{
		secret: env.SECRET,
		key: 'twake.session',
		expires: 1
	},
	async ({ event, resolve }) => {
		await ldapConnectionHandler();

		return resolve(event);
	}
);

export const handleError = errorHandler;
