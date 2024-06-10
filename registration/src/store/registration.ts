import type { UserInfo, RegistrationStepType } from '$types';
import { writable, get } from 'svelte/store';
import type { ActionData } from '../routes/$types';

const defaultUserInfo = {
	firstName: '',
	lastName: '',
	nickName: ''
};

export const form = writable<ActionData>();
export const registrationStep = writable<RegistrationStepType>('home');

export const rewindRegistrationStep = () => {
	const currentStep = get(registrationStep);

	if (currentStep === 'home') return;

	if (currentStep === 'phone') return registrationStep.set('home');

	if (currentStep === 'otp') registrationStep.set('phone');

	if (currentStep === 'nickname') registrationStep.set('phone');

	if (currentStep === 'password') registrationStep.set('nickname');
};

export const nextRegistrationStep = () => {
	const currentStep = get(registrationStep);

	if (currentStep === 'home') return registrationStep.set('phone');

	if (currentStep === 'phone') return registrationStep.set('otp');

	if (currentStep === 'otp') return registrationStep.set('confirmed');

	if (currentStep === 'confirmed') return registrationStep.set('nickname');

	if (currentStep === 'nickname') return registrationStep.set('password');

	if (currentStep === 'password') return registrationStep.set('success');
};

export const nickNameStepInfo = writable<UserInfo>(defaultUserInfo);

/**
 * Resets the default user info Store
 */
export const resetUserInfo = (): void => {
	nickNameStepInfo.set(defaultUserInfo);
};
