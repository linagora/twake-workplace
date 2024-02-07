<script lang="ts">
	import { enhance } from '$app/forms';
	import PrimaryButton from '$lib/components/button/PrimaryButton.svelte';
	import OtpField from '$lib/components/input/OtpField.svelte';
	import { maskPhone } from '$lib/utils/phone';
	import { t } from 'svelte-i18n';

	export let handler: () => void = () => {};
	export let phone: string = '+21652128155';

	let value = '';
	let resendCounter = 60;
	let sendOtpForm: HTMLFormElement;

	setInterval(() => {
		if (resendCounter > 0) resendCounter--;
	}, 1000);

	const handleSendOtp = () => {
		if (!phone || !value) return;

		if (resendCounter > 0) return;

		sendOtpForm.requestSubmit();

		resendCounter = 60;
	};

	$: disabled = value.length < 6;
</script>

<form use:enhance action="?/sendOtp" method="POST" class="hidden" bind:this={sendOtpForm}>
	<input type="text" name="phone" bind:value={phone} required />
</form>

<div class="flex flex-col px-4 lg:px-0 lg:h-fit h-screen">
	<div class="w-[386px] h-20" />
	<div class="h-28 py-4 flex-col justify-start items-center gap-1 flex">
		<div class="self-stretch text-center text-zinc-900 text-[22px] font-semibold leading-7">
			{$t('Confirm-your-code')}
		</div>
		<div class="text-center flex flex-col">
			<span class="text-gray-400 text-base font-normal leading-normal">{$t('6-digit')}</span><span
				class="text-zinc-900 text-base font-semibold leading-normal tracking-tight"
				>{maskPhone(phone)}</span
			>
		</div>
	</div>
	<div class="py-4 flex p-[16px] flex-col items-center gap-[12px] self-stretch">
		<OtpField bind:value />
	</div>
	<div class="w-[386px] h-[236px]" />
	<div class="mt-auto py-4">
		<PrimaryButton ariaLabel="next" {disabled} {handler}>{$t('Next')}</PrimaryButton>
		<div class="w-full h-12 px-6 py-3.5 justify-center items-center inline-flex">
			<div class="text-center flex space-x-1">
				<span class="text-gray-400 text-sm font-medium leading-tight tracking-tight"
					>Didn't get the code?</span
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
