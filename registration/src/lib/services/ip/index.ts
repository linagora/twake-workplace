import { env } from '$env/dynamic/public';
import { getUrl } from '$lib/utils/url';
import validator from 'validator';
import type { CountryInformation } from '$types';

/**
 * Returns the user country based on his IP address
 *
 * @param {string} ip - the IP address
 * @returns {Promise<string>} - the user country
 */
export const getUserCountry = async (ip: string): Promise<string> => {
	try {
		if (!validator.isIP(ip)) {
			return '';
		}

		const api = getUrl(env.PUBLIC_GEO_API_URL);
		const response = await fetch(`${api}/ip/country/${ip}.json`);
		const info = (await response.json()) as CountryInformation;

		return info.country ?? '';
	} catch (err) {
		console.error('Failed to fetch the IP country', err);

		return '';
	}
};
