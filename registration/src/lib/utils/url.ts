import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { env } from '$env/dynamic/public';
import type { ApplicationType } from '$types';
import { isMobile } from '$utils/device';
import { getApplicationGotoLink, getApplicationStoreUrl } from '$utils/product';

/**
 * formats a url by adding a trailing slash if it doesn't have one
 *
 * @param {string} url - the url to check
 * @returns {string} - the url with a trailing slash if it doesn't have one
 */
export const getUrl = (url: string): string => (url.endsWith('/') ? url : `${url}/`);

/**
 * Extracts the domain name from a subdomain string.
 *
 * @param {string} subdomain - The input subdomain string.
 * @returns {string} The extracted domain name.
 */
export const extractMainDomain = (subdomain: string): string => {
	const firstDotIndex = subdomain.indexOf('.');

	return subdomain.substring(firstDotIndex + 1);
};

/**
 * opens the application link.
 *
 * @param {ApplicationType} app - The application to open.
 */
export const attemptToOpenApp = (app: ApplicationType): void => {
	if (!browser) return;

	const link = getApplicationGotoLink(app);

	goto(link);

	if (isMobile()) {
		const appStoreUrl = getApplicationStoreUrl(app);

		if (appStoreUrl && appStoreUrl.url) {
			setTimeout(() => {
				navigator.clipboard.writeText(link).catch(console.error);

				window.location.href = appStoreUrl.url;
			}, 250);
		}
	}
};

/**
 * Constructs the OIDC redirect URL
 *
 * @param {string} url - the destination url
 */
export const getOidcRedirectUrl = (url: string): string =>
	`${env.PUBLIC_OIDC_PROVIDER}?redirectUrl=${url}`;

/**
 * builds an Oath2 redirect url.
 *
 * @param {string} challenge - the app challenge
 * @param {string} redirectUri - the app redirect uri
 * @param {string} clientId - the app client id
 */
export const getOath2RedirectUri = (challenge: string, redirectUri: string, clientId: string) => {
	const url = new URL(env.PUBLIC_AUTHORISATION_URL);

	url.searchParams.set('client_id', clientId);
	url.searchParams.set('redirect_uri', redirectUri);
	url.searchParams.set('response_type', 'code');
	url.searchParams.set('scope', 'openid profile email offline_access');
	url.searchParams.set('code_challenge_method', 'S256');
	url.searchParams.set('code_challenge', challenge);

	return url.toString();
};
