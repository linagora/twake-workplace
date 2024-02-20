// See https://kit.svelte.dev/docs/types#app

import type { ApplicationType, RegistrationStepType } from './types';

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			session: import('svelte-kit-cookie-session').Session<SessionData>;
		}

		interface PageData {
			session: SessionData;
		}
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};

interface SessionData {
	phone: string | null;
	otp_request_token: string | null;
	last_sent: number | null;
	verified: boolean = false;
	authenticated: boolean = false;
	user?: string;
	firstName?: string;
	lastName?: string;
	nickname?: string;
	redirectUrl?: string;
	postLoginUrl?: string;
	challenge?: string;
	clientId?: string;
	country?: string;
	app?: ApplicationType;
	step: RegistrationStepType = 'home';
}
