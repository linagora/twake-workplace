import { browser } from '$app/environment';
import { env } from '$env/dynamic/private';
import { getUrl } from '$lib/utils/url';
import type { AuthResponse, TokenResponse } from '$types';
import logger from '$services/logger';

class LemonLdapAuthService {
	portal = '';
	cookieName = 'lemonldap';

	constructor() {
		if (!env.AUTH_URL) {
			logger.error('LemonLDAP auth service: missing portal url');
			return;
		}

		this.portal = getUrl(env.AUTH_URL);
	}

	/**
	 * Fetches the login token from the auth portal.
	 *
	 * @returns {Promise<string>} - the login token to be used
	 */
	private fetchToken = async (): Promise<string> => {
		try {
			const response = await fetch(`${this.portal}`, {
				headers: {
					Accept: 'application/json'
				}
			});

			const { token } = (await response.json()) as TokenResponse;

			return token;
		} catch (err) {
			logger.error('[LemonLdap] Failed to fetch login token from portal', { err });
			throw err;
		}
	};

	/**
	 * authenticates a user against the auth portal and returns the lemonldap session id.
	 *
	 * @param {string} user - the username to authenticate
	 * @param {string} password - the password to authenticate
	 * @returns {Promise<string>} - the user session token to be used as a cookie.
	 */
	login = async (user: string, password: string): Promise<string> => {
		try {
			const token = await this.fetchToken();
			const response = await fetch(this.portal, {
				method: 'POST',
				headers: {
					Accept: 'application/json'
				},
				body: new URLSearchParams({ user, password, token })
			});

			const { id } = (await response.json()) as AuthResponse;

			if (!id) {
				throw new Error('invalid credentials');
			}

			return id;
		} catch (err) {
			logger.error('[LemonLdap] Failed to authenticate user', { err });
			throw err;
		}
	};

	/**
	 * Redirects the user to the auth portal login page.
	 */
	redirectToLogin = async () => {
		try {
			if (browser) {
				window.location.href = `${this.portal}/login`;
			} else {
				logger.warn('Failed to redirect to login, not in browser environment');
			}
		} catch (err) {
			logger.error('Failed to redirect to login', { err });
			throw err;
		}
	};
}

export default new LemonLdapAuthService();
