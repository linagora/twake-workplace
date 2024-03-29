<script lang="ts">
	import { passwordRecoveryStep } from '$store';
	import FormHeader from '$components/dispaly/FormHeader.svelte';
	import PhoneStep from '$components/forms/recovery-steps/PhoneStep.svelte';
	import OtpStep from '$components/forms/recovery-steps/OTPStep.svelte';
	import PasswordStep from '$components/forms/recovery-steps/PasswordStep.svelte';
</script>

<div
	class="w-full flex flex-col md:flex-row justify-end h-full lg:max-h-[668px] large:min-h-[768px] large:max-h-[768px] 2xl:max-h-[768px]"
>
	<div
		class="bg-white shadow-[0px_0px_52px_0px_rgba(0,0,0,0.08)] md:rounded-3xl flex flex-col w-full lg:w-[400px] xl:w-[504px] md:px-[60px] h-full"
	>
		<FormHeader show={false} />
		{#if $passwordRecoveryStep === 'otp'}
			<OtpStep />
		{:else if $passwordRecoveryStep === 'password' || $passwordRecoveryStep === 'success'}
			<PasswordStep />
		{:else}
			<PhoneStep />
		{/if}
	</div>
</div>
