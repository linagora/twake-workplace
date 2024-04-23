<script lang="ts">
	import TelField from '$components/input/TelField.svelte';
	import { t } from 'svelte-i18n';
	import { userCountry, recoveryForm } from '$store';
	import PrimaryButton from '$components/buttons/PrimaryButton.svelte';
	import { createUserFormSchema } from '$lib/schemas/zodSchema';
	import { isPhoneTaken } from '$utils/api';
	import type { E164Number } from 'svelte-tel-input/types';
	import { enhance } from '$app/forms';

	export let value: null | E164Number = null;
	export let valid = true;

	let sendOtpForm: HTMLFormElement;
	let loading = false;
	let phoneChecked = false;
	let phoneTaken = true;
	let formLoading = false;

	$: disabled = !valid || !phoneTaken || loading || !value || !phoneChecked;
	$: validPhoneFormat = createUserFormSchema.safeParse({ phone: value }).success;

	const checkPhone = async () => {
		phoneChecked = false;
		phoneTaken = true;

		if (!value || !validPhoneFormat || phoneChecked) return;

		loading = true;
		phoneChecked = true;
		phoneTaken = await isPhoneTaken(value);

		loading = false;
	};

	const handler = () => {
		if (!value || disabled) return;

		sendOtpForm.requestSubmit();
	};
</script>

<form
	action="?/sendRecoveryOTP"
	method="POST"
	class="hidden"
	bind:this={sendOtpForm}
	use:enhance={() => {
		formLoading = true;

		return async ({ update }) => {
			formLoading = false;

			update();
		};
	}}
>
	<input type="text" name="phone" bind:value required />
</form>

<div class="flex flex-col px-4 lg:px-0 h-full pb-[28px] lg:pb-6">
	<div class="w-[386px] h-20" />
	<div class="py-4 flex-col justify-start items-center gap-1 flex">
		<div
			class="self-stretch text-center text-[22px] font-semibold text-disabled-text not-italic leading-[28px]"
		>
			{$t('recover-password')}
		</div>
		<div
			class="self-stretch text-center text-[16px] tracking-[0px] text-[#99A0A9] not-italic leading-[24px]"
		>
			{$t('recovery-phone-prompt')}
		</div>
	</div>
	<div class="py-4">
		<TelField
			bind:valid
			bind:value
			bind:selectedCountry={$userCountry}
			{loading}
			onInput={checkPhone}
		/>
	</div>
	{#if $recoveryForm?.invalid_phone || $recoveryForm?.phone_not_found}
		<div class="text-xs font-medium leading-4 pt-1 tracking-wide text-left text-error px-5">
			{$t('invalid phone number')}
		</div>
	{:else if !phoneTaken}
		<div class="text-xs font-medium leading-4 pt-1 tracking-wide text-left text-error px-5">
			{$t('phone-not-found')}
		</div>
	{:else if $recoveryForm?.recovery_send_failed}
		<div class="text-xs font-medium leading-4 pt-1 tracking-wide text-left text-error px-5">
			{$t('failed-to-send-otp')}
		</div>
	{/if}
	<div class="mt-auto py-4">
		<PrimaryButton ariaLabel="next" {disabled} {handler} loading={formLoading}
			>{$t('Next')}</PrimaryButton
		>
	</div>
</div>
