import { writable, get } from 'svelte/store';
import type { ActionData } from '../routes/$types';
import type { RegistrationStepType, ApplicationType, Tab, PasswordRecoveryStepType } from '$types';
import type { CountryCode } from 'svelte-tel-input/types';
import type { ActionData as RecoveryActionData } from '../routes/recover-password/$types';
import { goto } from '$app/navigation';

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
export const showBanner = writable<boolean>(true);
export const passwordRecoveryStep = writable<PasswordRecoveryStepType>('phone');
export const verifiedRecovery = writable<boolean>(false);
export const recoveryPhone = writable<string>('');
export const recoveryForm = writable<RecoveryActionData>();

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

export const nextPasswordRecoveryStep = () => {
	const currentStep = get(passwordRecoveryStep);

	if (currentStep === 'phone') return passwordRecoveryStep.set('otp');
	if (currentStep === 'otp') return passwordRecoveryStep.set('password');
	if (currentStep === 'password') return passwordRecoveryStep.set('success');
	if (currentStep === 'success') return goto('/?login', { replaceState: true });
};

export const rewindPasswordRecoveryStep = () => {
	const currentStep = get(passwordRecoveryStep);

	if (currentStep === 'phone') return goto('/');
	if (currentStep === 'otp') return passwordRecoveryStep.set('phone');
	if (currentStep === 'password') return passwordRecoveryStep.set('otp');
};
