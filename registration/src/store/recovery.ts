import { writable, get } from 'svelte/store';
import type { ActionData as RecoveryActionData } from '../routes/recover-password/$types';
import { goto } from '$app/navigation';
import type { PasswordRecoveryStepType } from '$types';

export const passwordRecoveryStep = writable<PasswordRecoveryStepType>('phone');
export const verifiedRecovery = writable<boolean>(false);
export const recoveryPhone = writable<string>('');
export const recoveryForm = writable<RecoveryActionData>();

export const nextPasswordRecoveryStep = () => {
	const currentStep = get(passwordRecoveryStep);

	if (currentStep === 'phone') return passwordRecoveryStep.set('otp');
	if (currentStep === 'otp') return passwordRecoveryStep.set('password');
	if (currentStep === 'password') return passwordRecoveryStep.set('success');
	if (currentStep === 'success') return goto('/login');
};

export const rewindPasswordRecoveryStep = () => {
	const currentStep = get(passwordRecoveryStep);

	if (currentStep === 'phone') return goto('/');
	if (currentStep === 'otp') return passwordRecoveryStep.set('phone');
	if (currentStep === 'password') return passwordRecoveryStep.set('otp');
};
