import { env } from '$env/dynamic/private';
import { handleSession } from 'svelte-kit-cookie-session';
import { errorHandler } from '$utils/error';
import { ldapConnectionHandler } from '$utils/db';
import { handleProxy, PROXY_PATHS } from '$utils/proxy';

export const handle = handleSession(
	{
		secret: env.SECRET,
		key: 'twake.session',
		expires: 1
	},
	async ({ event, resolve }) => {
		await ldapConnectionHandler();

		for (const path of PROXY_PATHS) {
			if (event.url.pathname.startsWith(path)) {
				return await handleProxy({ event, resolve });
			}
		}

		return resolve(event);
	}
);

export const handleError = errorHandler;
