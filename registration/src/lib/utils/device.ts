import { browser } from '$app/environment';
import type { PlatformType } from '../../types';

/**
 * Detects whether the user is on a mobile device or not.
 *
 * @returns {boolean}
 */
export const isMobile = (): boolean =>
	browser && /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);

/**
 * Get the user platform.
 *
 * @returns {PlatformType} The user platform ( server, web, android or ios)
 */
export const getPlatform = (): PlatformType => {
	if (!browser) return 'server';

	if (!isMobile()) return 'web';

	if (navigator.userAgent.match(/Android/i)) return 'android';
	if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) return 'ios';

	return 'web';
};
