import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import logger from '$services/logger';

export const PROXY_PATHS = ['/oauth2', '/.well-known'];
export const PROXY_AUTH_PATH = '/oauth2/authorize';

export const handleProxy = (async ({ event }) => {
	const { request, url } = event;

	const proxiedUrl = new URL(env.AUTH_URL);
	const requestHeaders = new Headers(request.headers);

	proxiedUrl.pathname = url.pathname;
	proxiedUrl.search = url.search;

	requestHeaders.delete('host');
	requestHeaders.delete('connection');

	if (url.pathname.startsWith(PROXY_AUTH_PATH)) {
		return redirectToLogin(url.origin, proxiedUrl.toString());
	}

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

/**
 * Redirects user back to login page with post_login_redirect_url
 *
 * @param {string} url - the url to redirect to after login.
 * @param {string} base - the base url.
 * @returns {Response} - the redirect response.
 */
const redirectToLogin = (base: string, url: string): Response => {
	const loginUrl = new URL(base);

	loginUrl.searchParams.set('post_login_redirect_url', url);
	loginUrl.searchParams.set('simple_redirect', 'true');

	return Response.redirect(loginUrl.toString(), 302);
};
