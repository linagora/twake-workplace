import ldapjs from 'ldapjs';
import { env } from '$env/dynamic/private';
import type { SearchResult } from '../../../types';

class LdapClient {
	private client: ldapjs.Client | undefined;
	private ready: Promise<void>;
	private base: string | undefined;

	constructor() {
		this.ready = this.initClient();
	}

	/**
	 * Initializes the LDAP client.
	 */
	private initClient = async (): Promise<void> => {
		const { LDAP_URL, LDAP_DN, LDAP_ADMIN_PASSWORD, LDAP_BASE } = env;

		if (!LDAP_URL || !LDAP_DN || !LDAP_ADMIN_PASSWORD || !LDAP_BASE) {
			console.warn('Missing LDAP credentials');
			return;
		}

		this.base = LDAP_BASE;

		const client = ldapjs.createClient({
			url: LDAP_URL
		});

		return new Promise((resolve, reject) => {
			client.bind(LDAP_DN, LDAP_ADMIN_PASSWORD, (err) => {
				if (err) {
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
	 * Find LDAP
	 * @param field
	 * @param value
	 * @param attributes
	 * @returns
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
					reject(err);
				}

				resolve();
			});
		});
	};
}

export default new LdapClient();
