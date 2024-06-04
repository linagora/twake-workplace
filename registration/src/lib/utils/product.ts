import { env } from '$env/dynamic/public';
import type { ApplicationType, IApplicationStorePayload } from '$types';
import { isMobile, getPlatform } from '$utils/device';

/**
 * Get the store url for an application.
 * @param {ApplicationType} app - The application to open.
 * @return {IApplicationStorePayload | undefined}
 */
export const getApplicationStoreUrl = (
	app: ApplicationType
): IApplicationStorePayload | undefined => {
	if (isMobile()) {
		const platform = getPlatform();

		if (platform === 'android' && app === 'tmail') {
			return {
				type: 'play_store_url',
				url: env.PUBLIC_TMAIL_PLAYSTORE_URL
			};
		}

		if (platform === 'android' && app === 'chat') {
			return {
				type: 'play_store_url',
				url: env.PUBLIC_TWAKE_PLAYSTORE_URL
			};
		}

		if (platform === 'ios' && app === 'tmail') {
			return {
				type: 'app_store_url',
				url: env.PUBLIC_TMAIL_APPSTORE_URL
			};
		}

		if (platform === 'ios' && app === 'chat') {
			return {
				type: 'app_store_url',
				url: env.PUBLIC_TWAKE_APPSTORE_URL
			};
		}
	}
};

/**
 * Get the deep link for an application.
 *
 * @param {ApplicationType} app - The application to open.
 * @return {string | undefined}
 */
export const getApplicationDeepLink = (app: ApplicationType): string => {
	if (app === 'tdrive') {
		return env.PUBLIC_TDRIVE_WEB;
	}

	if (app === 'tmail') {
		return `${env.PUBLIC_TMAIL_MAGIC_LINK}redirect`;
	}

	return `${env.PUBLIC_TWAKE_MAGIC_LINK}redirect`;
};

/**
 * returns the application url.
 *
 * @param {ApplicationType} app - The application to open.
 * @returns {string} the application url.
 */
export const getApplicationGotoLink = (app: ApplicationType): string => {
	if (isMobile()) {
		return getApplicationDeepLink(app);
	}

	if (app === 'tdrive') {
		return env.PUBLIC_TDRIVE_WEB;
	}

	if (app === 'tmail') {
		return env.PUBLIC_TMAIL_WEB;
	}

	return env.PUBLIC_TWAKE_WEB;
};
