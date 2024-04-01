import { writable } from 'svelte/store';

export const redirectUrl = writable<string | null>(null);
export const challenge = writable<string | null>(null);
export const clientId = writable<string | null>(null);
