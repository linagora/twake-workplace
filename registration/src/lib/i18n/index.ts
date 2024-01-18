import { browser } from '$app/environment';
import { getLocaleFromNavigator, init, register } from 'svelte-i18n';

register('en', () => import('./en.json'));
register('fr', () => import('./fr.json'));
register('ru', () => import('./ru.json'));
register('vi', () => import('./vi.json'));
register('ar', () => import('./ar.json'));

const fallbackLocale = 'en';

init({
	fallbackLocale,
	initialLocale: browser ? getLocaleFromNavigator() : fallbackLocale
});
