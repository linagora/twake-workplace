<script lang="ts">
	import { t } from 'svelte-i18n';
	import PrimaryButton from '$components/button/PrimaryButton.svelte';
	import AppLogo from '$components/logo/AppLogo.svelte';
	import SecondaryButton from '$components/button/SecondaryButton.svelte';
	import LinkButton from '$components/button/LinkButton.svelte';
	import { activeTab, registrationStep } from '$store';

	const startRegistration = () => {
		activeTab.set('register');
		registrationStep.set('phone');
	};

	const startLogin = () => {
		activeTab.set('login');
	};
</script>

<div class="flex flex-col px-4 lg:px-0 h-full w-full pt-[188px] lg:pt-[169px] pb-[28px] lg:pb-6">
	<div class="flex p-[16px] flex-col items-center gap-[10px] self-stretch">
		<AppLogo type="landing" />
	</div>
	<div class="flex p-[16px] justify-center items-center gap-[10px] self-stretch w-full">
		<div class="flex-[1_0_0] text-center text-[17px] font-medium tracking-[0px] w-full">
			{$t('end-to-end-encryption-collaborative-features-for-secure-and-efficient-teamwork')}
		</div>
	</div>
	<div class="flex flex-col mt-auto gap-4 space-y-4 py-4">
		<PrimaryButton ariaLabel="next" handler={startRegistration}
			>{$t('Create-Twake-ID')}</PrimaryButton
		>
		<SecondaryButton handler={startLogin}>
			{$t('Sign in')}
		</SecondaryButton>
		<LinkButton>
			{$t('Use-company-server')}
		</LinkButton>
	</div>
</div>
