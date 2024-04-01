import type { Attribute } from 'ldapjs';

export interface IOtpSendPayload {
	phone_number: string;
	text: string;
	channel: 'sms' | 'voice_sms';
	sender: string;
	code_length: number;
}

export interface ISmsSentResponse {
	code: number;
	message: string;
	ticket_number?: string;
	otp_request_token?: string;
}

export interface IValidateOTPPayload {
	code: string;
	phone_number: string;
	otp_request_token: string;
}

export interface IValidateOTPResponse {
	code: string;
	message: string;
	remaining_number_of_attempts: number;
}

export interface SendSMSPayload {
	text: string;
	recipients: Destination[];
	sender: string;
}

export interface Destination {
	phone_number: string;
}

export type SearchResult = Record<string, string | string[] | number>;

export interface User {
	uid: string;
	cn: string;
	sn: string;
	givenName: string;
	userPassword: string;
	mobile: string;
	displayName?: string;
	mail?: string;
	objectclass: 'inetOrgPerson';
}

export interface AuthAPIResponse {
	error: string;
	result: number;
}

export interface AuthResponse extends AuthAPIResponse {
	id: string;
}

export interface TokenResponse extends AuthAPIResponse {
	token: string;
}

export type Tab = 'register' | 'login';

export type PasswordType = 'text' | 'password';

export type VerificationResult = 'correct' | 'wrong' | 'timeout';

export type PlatformType = 'web' | 'android' | 'ios' | 'server';

export type ApplicationType = 'tdrive' | 'tmail' | 'chat' | 'default';

export type LogoType = 'landing' | 'header' | 'icon';

export interface IApplicationStorePayload {
	type: 'play_store_url' | 'app_store_url';
	url: string;
}

export interface CountryInformation {
	ip: string;
	country?: string;
	country_3?: string;
	name?: string;
}

export type RegistrationStepType =
	| 'home'
	| 'phone'
	| 'otp'
	| 'confirmed'
	| 'nickname'
	| 'password'
	| 'success';

export interface LDAPModification {
	type: string;
	values: string[];
}

export interface LDAPChangePayload {
	operation: 'add' | 'delete' | 'replace';
	modification: LDAPModification | Attribute;
}

export type PasswordRecoveryStepType = 'phone' | 'otp' | 'password' | 'success';
