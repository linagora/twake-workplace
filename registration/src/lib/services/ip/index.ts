import { env } from '$env/dynamic/public';
import { getUrl } from '$lib/utils/url';
import validator from 'validator';
import type { CountryInformation } from '$types';
import logger from '$services/logger';

/**
 * Returns the user country based on his IP address
 *
 * @param {string} ip - the IP address
 * @returns {Promise<string>} - the user country
 */
export const getUserCountry = async (ip: string): Promise<string> => {
	try {
		if (!validator.isIP(ip)) {
			logger.warn(`invalid IP adress: ${ip}`, { service: 'IP service' });

			return '';
		}

		const api = getUrl(env.PUBLIC_GEO_API_URL);
		const response = await fetch(`${api}/ip/country/${ip}.json`);
		const info = (await response.json()) as CountryInformation;

		return info.country ?? '';
	} catch (err) {
		logger.error('user country lookup failed', { service: 'IP service' });

		return '';
	}
};
