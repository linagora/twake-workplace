import { writable, get } from 'svelte/store';
import type { ActionData } from '../routes/$types';
import type { RegistrationStepType, ApplicationType, Tab } from '../types';
import type { CountryCode } from 'svelte-tel-input/types';

export const form = writable<ActionData>();
export const verified = writable<boolean>(false);
export const phone = writable<string>('');
export const verifiedPhones = writable<string[]>([]);
export const redirectUrl = writable<string | null>(null);
export const challenge = writable<string | null>(null);
export const clientId = writable<string | null>(null);
export const activeTab = writable<Tab>('register');
export const userCountry = writable<CountryCode | null>(null);
export const app = writable<ApplicationType>('default');
export const registrationStep = writable<RegistrationStepType>('home');

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

export const rewindRegistrationStep = () => {
	const currentStep = get(registrationStep);

	if (currentStep === 'home') return;

	if (currentStep === 'phone') {
		registrationStep.set('home');
		return;
	}

	if (currentStep === 'otp') {
		registrationStep.set('phone');
		return;
	}

	if (currentStep === 'nickname') {
		registrationStep.set('phone');
		return;
	}

	if (currentStep === 'password') {
		registrationStep.set('nickname');
		return;
	}
};

export const nextRegistrationStep = () => {
	const currentStep = get(registrationStep);

	if (currentStep === 'home') {
		registrationStep.set('phone');
		return;
	}

	if (currentStep === 'phone') {
		registrationStep.set('otp');
		return;
	}

	if (currentStep === 'otp') {
		registrationStep.set('confirmed');
		return;
	}

	if (currentStep === 'confirmed') {
		registrationStep.set('nickname');
		return;
	}

	if (currentStep === 'nickname') {
		registrationStep.set('password');
		return;
	}

	if (currentStep === 'password') {
		registrationStep.set('success');
		return;
	}
};
