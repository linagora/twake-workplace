import { writable, get } from 'svelte/store';
import type { ActionData } from '../routes/$types';
import type { ApplicationType, Tab } from '../types';

export const form = writable<ActionData>();
export const verified = writable<boolean>(false);
export const phone = writable<string>('');
export const verifiedPhones = writable<string[]>([]);
export const redirectUrl = writable<string | null>(null);
export const challenge = writable<string | null>(null);
export const clientId = writable<string | null>(null);
export const activeTab = writable<Tab>('register');
export const userCountry = writable<string>('');
export const app = writable<ApplicationType>('default');

verified.subscribe((v) => {
	if (v === true) {
		verifiedPhones.update((phones) => [...phones, get(phone)]);
	}
});

phone.subscribe((v) => {
	if (get(verifiedPhones).includes(v)) {
		verified.set(true);
	} else {
		verified.set(false);
	}
});
