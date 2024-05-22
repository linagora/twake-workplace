import { writable } from 'svelte/store';

export const redirectUrl = writable<string | null>(null);

