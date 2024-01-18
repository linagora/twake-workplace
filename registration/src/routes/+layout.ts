import { browser } from '$app/environment';
import { getLocaleFromNavigator, locale, waitLocale } from 'svelte-i18n';
import type { LayoutLoad } from './$types';
import '$lib/i18n';

export const load: LayoutLoad = async () => {
	if (browser) {
		locale.set(getLocaleFromNavigator());
	}

	await waitLocale();
};
