import { writable } from 'svelte/store';
import type { CountryCode } from 'svelte-tel-input/types';
import type { Tab } from '$types';

export const userCountry = writable<CountryCode | null>(null);
export const activeTab = writable<Tab>('register');
