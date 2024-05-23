import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { env } from '$env/dynamic/public';
import logger from '$services/logger';

/**
 * Send a support mail to request account deletion.
 *
 * @param {string} user - User to request account deletion.
 */
export const sendAccountDeletionMail = (user: string) => {
	if (!browser) return;

	const email = env.PUBLIC_SUPPORT_EMAIL ?? 'software@linagora.com';

	try {
		const subject = `${user} account deletion request`;
		const url = `mailto:${email}?subject=${subject}`;

		goto(url);
	} catch (error) {
		logger.error('Failed to send account deletion email to support', { error });
	}
};
