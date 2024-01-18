<script lang="ts">
	import PrimaryButton from './../button/PrimaryButton.svelte';
	import OutlineButton from './../button/OutlineButton.svelte';
	import SubmitButton from '../button/SubmitButton.svelte';
	import TextField from '../input/TextField.svelte';
	import { maskPhone } from '$lib/utils/phone';
	import { enhance } from '$app/forms';
	import { form, verified } from '../../../store';
	import { validateOTP } from '$lib/utils/password';
	import ArrowLeft from '../icons/ArrowLeft.svelte';
	import Confirmed from '../icons/Confirmed.svelte';
	import { t } from 'svelte-i18n';
	import Fail from '../dispaly/Fail.svelte';

	export let phone: string;

	let value: string = '';
	let open = false;
	let sendOtpForm: HTMLFormElement;
	let resendCounter = 60;

	setInterval(() => {
		if (resendCounter > 0) resendCounter--;
	}, 1000);

	const handleSendOtp = () => {
		if (!phone) return;

		if (resendCounter > 0 && open) return;

		sendOtpForm.requestSubmit();

		resendCounter = 60;
	};

	const openVerificationModal = async () => {
		handleSendOtp();
		open = true;
	};

	$: incorrect = $form?.incorrect === true;
	$: timeout = $form?.timeout === true;
	$: invalidPhone = $form?.phone_taken === true;
	$: inValid = !validateOTP(value) || invalidPhone || timeout;
	$: confirmed = $form?.verified === true;

	const handleContinue = () => {
		verified.set(true);
		open = false;
		confirmed = false;
		form.set({ verified: false });
	};
</script>

<span class="hidden absolute inset-y-0 right-0 lg:flex items-center px-2">
	<button
		aria-label="verify phone"
		type="button"
		class="ocus:outline-none focus:shadow-outline px-6 py-[10px] rounded-full bg-indigo-50 text-sm text-primary font-medium leading-5 h-11 items-center tracking-[0.1px]"
		on:click={openVerificationModal}
	>
		{$t('Verify')}
	</button>
</span>
<div class="lg:hidden pt-3" aria-label="verify phone">
	<PrimaryButton handler={openVerificationModal}>{$t('Verify phone number')}</PrimaryButton>
</div>
<div
	class="fixed w-full h-screen inset-0 z-50 overflow-hidden flex justify-center items-center {open ===
	false
		? 'hidden'
		: ''}"
	style="background: rgba(0,0,0,.6);"
>
	<div
		class="p-4 bg-white h-full lg:h-auto w-full {confirmed
			? 'lg:max-w-[510px] lg:px-[60px]'
			: 'lg:max-w-[448px] lg:px-[44px]'} mx-auto lg:rounded-2xl shadow-xl z-50 overflow-y-auto"
	>
		{#if confirmed}
			<div class="flex flex-col h-full pb-8 lg:py-8">
				<div class="flex flex-col items-center justify-center flex-1 lg:px-3 lg:pb-4">
					<div class="pb-4">
						<Confirmed />
					</div>
					<div class="lg:hidden">
						<h1 class="text-center text-[22px] not-italic font-semibold leading-7">
							{$t('your-phone-number-has-been-successfully-confirmed')}
						</h1>
					</div>
					<div class="hidden lg:flex flex-col space-y-2">
						<h1
							class="overflow-hidden text-[#1C1B1F] text-center text-ellipsis text-2xl not-italic font-semibold leading-8"
						>
							{$t('Phone number confirmation')}
						</h1>
						<p
							class="text-blueGray text-center text-[17px] not-italic font-medium leading-6 tracking-[-0.15px]"
						>
							{$t('Your phone number successfully confirmed')}
						</p>
					</div>
				</div>
				<div class="lg:hidden">
					<PrimaryButton handler={handleContinue} ariaLabel="continue sign up"
						>{$t('Continue Sign Up')}</PrimaryButton
					>
				</div>
				<div class="hidden lg:flex items-center justify-center">
					<div class="w-8/12">
						<OutlineButton handler={handleContinue} ariaLabel="continue sign up"
							>{$t('Continue Sign Up')}</OutlineButton
						>
					</div>
				</div>
			</div>
		{:else}
			<div class="flex flex-col h-full">
				<div class="flex justify-between items-center">
					<div class="hidden lg:block" />
					<button
						aria-label="close"
						class="modal-close hidden lg:block cursor-pointer z-50 -mr-8"
						type="button"
						on:click={() => (open = false)}
					>
						<svg
							width="56"
							height="56"
							viewBox="0 0 56 56"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g clip-path="url(#clip0_14295_114002)">
								<path
									fill-rule="evenodd"
									clip-rule="evenodd"
									d="M28 16.125C21.4331 16.125 16.125 21.4331 16.125 28C16.125 34.5669 21.4331 39.875 28 39.875C34.5669 39.875 39.875 34.5669 39.875 28C39.875 21.4331 34.5669 16.125 28 16.125ZM28 37.5C22.7631 37.5 18.5 33.2369 18.5 28C18.5 22.7631 22.7631 18.5 28 18.5C33.2369 18.5 37.5 22.7631 37.5 28C37.5 33.2369 33.2369 37.5 28 37.5ZM28 26.3256L32.2631 22.0625L33.9375 23.7369L29.6744 28L33.9375 32.2631L32.2631 33.9375L28 29.6744L23.7369 33.9375L22.0625 32.2631L26.3256 28L22.0625 23.7369L23.7369 22.0625L28 26.3256Z"
									fill="#1C1B1F"
								/>
							</g>
							<defs>
								<clipPath id="clip0_14295_114002">
									<rect x="4.25" y="4.25" width="47.5" height="47.5" rx="23.75" fill="white" />
								</clipPath>
							</defs>
						</svg>
					</button>
					<div class="lg:hidden" />
				</div>
				<form use:enhance action="?/sendOtp" method="POST" class="hidden" bind:this={sendOtpForm}>
					<input type="text" name="phone" bind:value={phone} required />
				</form>
				<div class="flex flex-col space-y-2">
					<div class="flex flex-row space-x-2 lg:items-center lg:justify-center text-disabled-text">
						<button
							aria-label="close"
							class="lg:hidden modal-close cursor-pointer z-50"
							type="button"
							on:click={() => (open = false)}
						>
							<ArrowLeft />
						</button>

						<h1
							class="hidden lg:block text-2xl font-semibold leading-8 tracking-normal text-center"
						>
							{$t('Phone number confirmation')}
						</h1>
						<h1 class="lg:hidden text-2xl font-semibold leading-8 tracking-normal text-left">
							{$t('Confirm your phone number')}
						</h1>
					</div>
					{#if invalidPhone}
						<span class="text-base font-medium leading-6 tracking-tight text-center text-red-400"
							>{$t('this phone is already taken')}</span
						>
					{:else if $form?.send_failed}
						<Fail>{$t('failed-to-send-otp-try-again-later')}</Fail>
					{:else if $form?.check_failed || $form?.missing}
						<Fail>{$t('failed-to-check-otp-try-again-later')}</Fail>
					{:else}
						<span
							class="text-[17px] font-medium leading-6 tracking-[-0.15px] text-center text-blueGray"
							>{$t('Enter 6 digit code we sent to')}:</span
						>
						<span
							class="text-[17px] font-medium leading-6 tracking-[-0.15px] text-center text-[#37383A]"
							>{maskPhone(phone)}</span
						>
					{/if}
				</div>
				{#if !invalidPhone}
					<form action="?/checkOtp" use:enhance method="POST" class="pb-10 flex flex-col h-full">
						<div class="my-5">
							<TextField
								label={$t('Code')}
								placeholder={$t('Code')}
								bind:value
								name="password"
								isInValid={incorrect}
								feedback={false}
							/>
							{#if incorrect}
								<div
									class="text-xs font-medium leading-4 tracking-tight text-left text-error px-5 pt-1 w-full"
								>
									{$t('entered-code-is-incorrect-try-again')}
								</div>
							{/if}
							{#if timeout}
								<div
									class="text-xs font-medium leading-4 tracking-tight text-left text-error px-5 pt-1"
								>
									{$t('too-many-wrong-attempts-has-been-made-try-again-later')}
								</div>
							{/if}
						</div>
						<div class="flex flex-col space-y-2 flex-1 justify-end">
							<SubmitButton disabled={inValid || $form?.send_failed} ariaLabel={$t('Confirm')}
								>{$t('Confirm')}</SubmitButton
							>
							<OutlineButton
								handler={handleSendOtp}
								disabled={resendCounter > 0 || timeout || $form?.send_failed}
							>
								{#if resendCounter === 0}
									{$t('Send code')}
								{:else}
									{$t('Send code again in')}: 0:{resendCounter}
								{/if}
							</OutlineButton>
						</div>
					</form>
				{:else}
					<div class="px-10 pb-10" />
				{/if}
			</div>
		{/if}
	</div>
</div>
