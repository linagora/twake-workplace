<script lang="ts">
	import TelField from '$components/input/TelField.svelte';
	import { t } from 'svelte-i18n';
	import { userCountry, form } from '$store';
	import PrimaryButton from '$components/buttons/PrimaryButton.svelte';
	import { isPhoneTaken } from '$utils/api';
	import type { E164Number } from 'svelte-tel-input/types';
	import { enhance } from '$app/forms';
	import UsedPhone from '$components/otp/UsedPhone.svelte';
  import { PhoneInput } from 'react-international-phone';
  import 'react-international-phone/style.css';
	import TelFieldReact from '$src/lib/components/input/TelFieldReact.svelte';


	export let value: null | E164Number = null;
	export let valid = true;

	let sendOtpForm: HTMLFormElement;
	let loading = false;
	let phoneChecked = false;
	let phoneTaken = false;
	let formLoading = false;

	$: disabled = !valid || phoneTaken || loading || !value || !phoneChecked || formLoading;

	const checkPhone = async () => {
		phoneChecked = false;
		phoneTaken = false;

		if (!value || !valid || phoneChecked) return;

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
	action="?/sendOtp"
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
	<div class="h-28 py-4 flex-col justify-start items-center gap-1 flex">
		<div class="self-stretch text-center text-zinc-900 text-[22px] font-semibold leading-7">
			{$t('Your-phone-number')}
		</div>
		<div
			class="self-stretch text-center text-gray-400 text-base font-normal leading-normal tracking-[0px] px-10"
		>
			{$t('please-confirm')}
		</div>
	</div>
	<div class="py-4">
		<TelFieldReact
			bind:valid
			bind:value
			bind:selectedCountry={$userCountry}
			{loading}
			onInput={checkPhone}
		/>
	</div>
	{#if $form?.invalid_phone || $form?.phone_taken}
		<div class="text-xs font-medium leading-4 pt-1 tracking-wide text-left text-error px-5">
			{$t('invalid phone number')}
		</div>
	{:else if $form?.send_failed}
		<div class="text-xs font-medium leading-4 pt-1 tracking-wide text-left text-error px-5">
			{$t('failed-to-send-otp')}
		</div>
	{:else if phoneTaken}
		<div class="relative w-full">
			<UsedPhone checked={phoneChecked} />
		</div>
	{/if}
	<div class="mt-auto py-4">
		<PrimaryButton ariaLabel="next" {disabled} {handler} loading={formLoading}
			>{$t('Next')}</PrimaryButton
		>
	</div>
</div>
