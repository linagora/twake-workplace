/**
 * check if username is taken using the check-nickname API
 *
 * @param {string} nickname - the nickname to check
 * @return {Promise<boolean>} - true if username is taken, false otherwise
 */
export const isNickNameTaken = async (nickname: string): Promise<boolean> => {
	try {
		const response = await fetch('/api/check-nickname', {
			method: 'POST',
			body: JSON.stringify({ nickname })
		});

		return response.status !== 200;
	} catch (error) {
		console.debug('failed to check nickname');
		return false;
	}
};

/**
 * fetch alternative nicknames using the suggest-nicknames API
 *
 * @param {string} firstname - the first name of the user
 * @param {string} lastname - the last name of the user
 * @return {string[]} - an array of alternative nicknames
 */
export const suggestNickNames = async (firstname: string, lastname: string): Promise<string[]> => {
	try {
		const response = await fetch('/api/suggest-nicknames', {
			method: 'POST',
			body: JSON.stringify({ firstname, lastname })
		});

		return await response.json();
	} catch (error) {
		console.debug('failed to suggest nicknames');
		return [];
	}
};

/**
 * check if the phone is taken using the check-phone API
 *
 * @param {string} phone - the phone number to check
 */
export const isPhoneTaken = async (phone: string): Promise<boolean> => {
	try {
		const response = await fetch('/api/check-phone', {
			method: 'POST',
			body: JSON.stringify({ phone })
		});

		const { available } = await response.json();

		return !available;
	} catch (error) {
		console.debug('failed to check phone');
		return false;
	}
};
