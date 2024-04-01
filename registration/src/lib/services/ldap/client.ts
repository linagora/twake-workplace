import ldapjs from 'ldapjs';
import { env } from '$env/dynamic/private';
import type { LDAPChangePayload, SearchResult } from '$types';
import logger from '$services/logger';

class LdapClient {
	private client: ldapjs.Client | undefined;
	private ready: Promise<void> | undefined;
	private base: string | undefined;

	/**
	 * Initializes the LDAP client.
	 */
	public initClient = async (): Promise<void> => {
		const { LDAP_URL, LDAP_DN, LDAP_ADMIN_PASSWORD, LDAP_BASE } = env;

		if (!LDAP_URL || !LDAP_DN || !LDAP_ADMIN_PASSWORD || !LDAP_BASE) {
			logger.fatal('Missing LDAP credentials, cannot init the LDAP service');

			throw new Error('Cannot connecto to LDAP, missing credentials');
		}

		this.base = LDAP_BASE;

		const client = ldapjs.createClient({
			url: LDAP_URL
		});

		this.ready = new Promise((resolve, reject) => {
			client.on('error', (err) => {
				logger.fatal('LDAP connection error', [err]);

				reject(err);
			});

			client.on('connect', () => {
				logger.info('LDAP connection established');
			});

			client.on('close', () => {
				logger.info('LDAP connection closed');
			});

			client.on('connectRefused', (err) => {
				logger.fatal('LDAP connection refused', err);

				reject(new Error('LDAP connection refused'));
			});

			client.bind(LDAP_DN, LDAP_ADMIN_PASSWORD, (err) => {
				if (err) {
					logger.fatal('LDAP authentication failed', [err]);

					reject(err);
				}

				this.client = client;
				resolve();
			});
		});
	};

	/**
	 * Returns the LDAP client reference if it's ready.
	 *
	 * @returns {Promise<ldapjs.Client>} - the LDAP client if ready.
	 */
	public getClient = async (): Promise<ldapjs.Client> => {
		await this.ready;

		if (!this.client) {
			logger.warn('LDAP client is not initialized');
			throw new Error('LDAP client not initialized');
		}

		return this.client;
	};

	/**
	 * Searches for LDAP entries.
	 *
	 * @param {string} filter - the filter string
	 * @example filter = 'cn=John Doe'
	 * @param {string | string[]} attributes - the LDAP attributes to return.
	 * @returns {Promise<SearchResult[]>} - the search results.
	 */
	public search = async (
		filter: string,
		attributes?: string | string[]
	): Promise<SearchResult[]> => {
		const client = await this.getClient();

		return new Promise((resolve, reject) => {
			client.search(
				this.base as string,
				{
					filter,
					scope: 'sub',
					attributes
				},
				(err, res) => {
					if (err) {
						reject(err);
					}

					const results: SearchResult[] = [];

					res.on('searchEntry', (entry) => {
						const found: SearchResult = {};

						entry.attributes.forEach((attribute) => {
							found[attribute.type] = attribute.vals;
						});

						results.push(found);
					});

					res.on('error', (err) => {
						logger.error('LDAP search error', [err]);
						reject(err);
					});

					res.on('end', () => {
						resolve(results);
					});
				}
			);
		});
	};

	/**
	 * Find LDAP operation
	 *
	 * @param {string} field - the field to search
	 * @param {string | number} value - the value to search
	 * @param {string[]} attributes - the LDAP attributes to return.
	 * @returns {Promise<SearchResult[]>} - the search results.
	 */
	public find = async (
		field?: string,
		value?: string | number,
		attributes?: string[]
	): Promise<SearchResult[]> => {
		const filter = field ? `(${field}=${value})` : '(objectClass=*)';

		return await this.search(filter, attributes);
	};

	/**
	 * INSERT LDAP operation
	 *
	 * @param {string} dn - the common name
	 * @param {T} entry - the generic LDAP object to insert
	 * @returns
	 */
	public insert = async <T>(dn: string, entry: T): Promise<void> => {
		const client = await this.getClient();
		const userDn = `${dn},${this.base}`;

		return new Promise((resolve, reject) => {
			client.add(userDn, entry as Record<string, string | number>, (err) => {
				if (err) {
					logger.error('LDAP insert error', [err]);

					reject(err);
				}

				resolve();
			});
		});
	};

	/**
	 * Update LDAP operation
	 *
	 * @param {string} dn - the common name
	 * @param {LDAPChangePayload} change - the ldap change payload
	 */
	public update = async (dn: string, change: ldapjs.Change): Promise<void> => {
		const client = await this.getClient();
		const userDn = `${dn},${this.base}`;

		return new Promise((resolve, reject) => {
			client.modify(userDn, [change], (err) => {
				if (err) {
					logger.error('LDAP update error', [err]);

					reject(err);
				}

				resolve();
			});
		});
	};
}

export default new LdapClient();
