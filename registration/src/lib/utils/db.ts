import { error } from '@sveltejs/kit';
import logger from '$services/logger';
import { init } from '$services/ldap';

export const ldapConnectionHandler = async (): Promise<void> => {
	try {
		await init();
	} catch (err) {
		logger.fatal('Error initializing the LDAP connection', { err });
		throw error(500, 'Oops! Something went wrong. Please try again later.');
	}
};
