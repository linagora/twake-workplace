import { env } from '$env/dynamic/private';
import { handleSession } from 'svelte-kit-cookie-session';
import { errorHandler } from '$utils/error';
import { ldapConnectionHandler } from '$utils/db';
import { handleProxy, PROXY_PATHS, PROXY_LOGOUT_SEARCH_PATH } from '$utils/proxy';

export const handle = handleSession(
	{
		secret: env.SECRET,
		key: 'twake.session',
		expires: 1
	},
	async ({ event, resolve }) => {
		if (event.url.search.startsWith(PROXY_LOGOUT_SEARCH_PATH)) {
			return await handleProxy({ event, resolve });
		}

		for (const path of PROXY_PATHS) {
			if (event.url.pathname.startsWith(path)) {
				return await handleProxy({ event, resolve });
			}
		}

		await ldapConnectionHandler();
		return resolve(event);
	}
);

export const handleError = errorHandler;
