import { browser } from '$app/environment';
import { env } from '$env/dynamic/private';
import { getUrl } from '$utils/url';
import type { AuthResponse, TokenResponse, lemonLDAPSessionInformation } from '$types';
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

	/**
	 * Logout from the lemonldap.
	 *
	 * @param {string} cookie - the lemonldap session cookie
	 */
	logout = async (cookie: string): Promise<void> => {
		try {
			await fetch(`${this.portal}/?logout=1`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					Cookie: `${this.cookieName}=${cookie}`
				}
			});
		} catch (err) {
			logger.error('Failed to logout', { err });
			throw err;
		}
	};

	/**
	 * Verify login session
	 *
	 * @param {string} cookie - the lemonldap session cookie
	 * @returns {Promise<boolean>} - true if the session is valid, false otherwise
	 */
	verify = async (cookie: string): Promise<boolean> => {
		try {
			const response = await fetch(this.portal, {
				headers: {
					Accept: 'application/json',
					Cookie: `${this.cookieName}=${cookie}`
				}
			});

			const { result }: { result: number } = await response.json();

			return result === 1;
		} catch (err) {
			logger.error('[LemonLdap] Failed to verify login session', { err });
			return false;
		}
	};

	/**
	 * Fetch the currently connected user from lemonldap
	 *
	 * @param {string} cookie - the lemonldap cookie
	 * @returns {Promise<string>} - the connected user
	 */
	fetchUser = async (cookie: string): Promise<string | undefined> => {
		try {
			const response = await fetch(`${this.portal}/mysession?whoami`, {
				headers: {
					Accept: 'application/json',
					Cookie: `${this.cookieName}=${cookie}`
				}
			});

			const { result }: lemonLDAPSessionInformation = await response.json();

			if (result === 0) {
				throw Error('Invalid session');
			}

			return result;
		} catch (err) {
			logger.warn('[LemonLdap] Failed to fetch user', { err });
		}
	};
}

export default new LemonLdapAuthService();
