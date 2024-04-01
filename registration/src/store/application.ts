import type { ApplicationType } from '$types';
import { writable, get } from 'svelte/store';

export const app = writable<ApplicationType>('default');

export const getAppName = () => {
	const currentApp = get(app);

	return currentApp === 'chat'
		? 'Twake chat'
		: currentApp === 'tdrive'
		? 'Twake drive'
		: currentApp === 'tmail'
		? 'Twake mail'
		: 'Twake';
};
