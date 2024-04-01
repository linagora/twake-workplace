import { browser } from '$app/environment';
import { getLocaleFromNavigator, locale, waitLocale } from 'svelte-i18n';
import type { LayoutLoad } from './$types';
import '$lib/i18n';
import logger from '$services/logger';

export const load: LayoutLoad = async () => {
	if (browser) {
		const detectedLocale = getLocaleFromNavigator();
		logger.info(`Detected locale from browser: ${detectedLocale}`);

		locale.set(detectedLocale);
	}

	await waitLocale();
};
