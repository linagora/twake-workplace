<script lang="ts">
	import { enhance } from '$app/forms';
	import PrimaryButton from '$components/buttons/PrimaryButton.svelte';
	import OtpField from '$components/input/OtpField.svelte';
	import { maskPhone } from '$utils/phone';
	import { t } from 'svelte-i18n';
	import { recoveryForm, recoveryPhone } from '$store';

	let value = '';
	let resendCounter = 60;
	let sendOtpForm: HTMLFormElement;
	let checkOtpForm: HTMLFormElement;
	let loading = false;

	setInterval(() => {
		if (resendCounter > 0) resendCounter--;
	}, 1000);

	const handleSendOtp = () => {
		if (!$recoveryPhone || resendCounter > 0) return;

		sendOtpForm.requestSubmit();

		resendCounter = 60;
	};

	const handleCheckOtp = () => {
		console.log('checking', $recoveryPhone);
		if (!$recoveryPhone || disabled) return;

		checkOtpForm.requestSubmit();
	};

	$: disabled = value.length < 6 || loading;
	$: timeout = $recoveryForm?.timeout;
</script>

<form
	action="?/verifyRecoveryOTP"
	method="POST"
	class="hidden"
	bind:this={checkOtpForm}
	use:enhance={() => {
		loading = true;

		return async ({ update }) => {
			loading = false;

			update();
		};
	}}
>
	<input type="text" name="password" bind:value required />
</form>

<form use:enhance action="?/sendRecoveryOTP" method="POST" class="hidden" bind:this={sendOtpForm}>
	<input type="text" name="phone" bind:value={$recoveryPhone} required />
</form>

<div class="flex flex-col px-4 lg:px-0 h-full pb-[28px] lg:pb-6">
	<div class="w-[386px] h-20" />
	<div class="h-28 py-4 flex-col justify-start items-center gap-1 flex">
		<div class="self-stretch text-center text-zinc-900 text-[22px] font-semibold leading-7">
			{$t('Confirm-your-code')}
		</div>
		<div class="text-center flex flex-col">
			<span class="text-gray-400 text-base font-normal leading-normal">{$t('6-digit')}</span><span
				class="text-zinc-900 text-base font-semibold leading-normal tracking-tight"
				>{maskPhone($recoveryPhone)}</span
			>
		</div>
	</div>
	<div class="py-4 flex p-4 flex-col items-center justify-center gap-3 self-stretch">
		<OtpField bind:value />
		<div class="flex items-center justify-center w-full">
			{#if $recoveryForm?.incorrect_recovery}
				<div
					class="text-xs font-medium leading-4 tracking-tight text-center text-error px-5 pt-1 w-full"
				>
					{$t('entered-code-is-incorrect-try-again')}
				</div>
			{/if}
			{#if $recoveryForm?.recovery_verify_failed}
				<div class="text-xs font-medium leading-4 tracking-tight text-center text-error px-5 pt-1">
					{$t('otp-check-failed')}
				</div>
			{/if}
			{#if timeout}
				<div class="text-xs font-medium leading-4 tracking-tight text-center text-error px-5 pt-1">
					{$t('too-many-wrong-attempts-has-been-made-try-again-later')}
				</div>
			{/if}
		</div>
	</div>
	<div class="mt-auto py-4">
		<PrimaryButton ariaLabel="next" {disabled} handler={handleCheckOtp} {loading}
			>{$t('Confirm')}</PrimaryButton
		>
		<div class="w-full h-12 px-6 py-3.5 justify-center items-center inline-flex">
			<div class="text-center flex space-x-1">
				<span class="text-gray-400 text-sm font-medium leading-tight tracking-tight"
					>{$t('no-code-received')}</span
				>
				<button type="button" disabled={resendCounter > 0} on:click={handleSendOtp}>
					{#if resendCounter === 0}
						<div class="text-primary text-sm font-medium leading-tight tracking-tight">
							{$t('Resend')}
						</div>
					{:else}
						<div class="text-gray-400 text-sm font-medium leading-tight tracking-tight">
							{$t('Resend-in')}: 0:{resendCounter}
						</div>
					{/if}
				</button>
			</div>
		</div>
	</div>
</div>
