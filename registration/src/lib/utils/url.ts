import { browser } from '$app/environment';
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

	window.location.assign(link);

	if (isMobile()) {
		const appStoreUrl = getApplicationStoreUrl(app);

		if (appStoreUrl && appStoreUrl.url) {
			setTimeout(() => {
				navigator.clipboard.writeText(link).catch(console.error);
				window.location.assign(appStoreUrl.url);
			}, 300);
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
