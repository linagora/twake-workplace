import { writable, get } from 'svelte/store';

export const verified = writable<boolean>(false);
export const phone = writable<string>('');
export const verifiedPhones = writable<string[]>([]);

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
