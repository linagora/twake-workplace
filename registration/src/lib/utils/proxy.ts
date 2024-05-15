import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import logger from '$services/logger';

export const PROXY_PATH = '/oath2';

export const handleProxy = (async ({ event }) => {
	const { request, url } = event;

	const proxiedUrl = new URL(env.AUTH_URL);
	const requestHeaders = new Headers(request.headers);

	proxiedUrl.pathname = url.pathname;
	proxiedUrl.search = url.search;

	requestHeaders.delete('host');
	requestHeaders.delete('connection');

	try {
		const response = await fetch(proxiedUrl.toString(), {
			redirect: 'manual',
			method: request.method,
			headers: requestHeaders
		});

		const responseHeaders = new Headers(response.headers);

		responseHeaders.delete('content-encoding');

		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: responseHeaders
		});
	} catch (error) {
		logger.error('Could not proxy request: ', { error });
		throw error;
	}
}) satisfies Handle;
