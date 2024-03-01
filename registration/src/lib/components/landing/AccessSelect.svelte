<script lang="ts">
	import { t } from 'svelte-i18n';
	import { activeTab, registrationStep, getAppName, app } from '$store';
	import LoginForm from '$components/forms/LoginForm.svelte';
	import FormHeader from '$components/dispaly/FormHeader.svelte';
	import CheckPhoneStep from '$components/forms/steps/CheckPhoneStep.svelte';
	import CheckOtpStep from '$components/forms/steps/CheckOTPStep.svelte';
	import CheckNickNameStep from '$components/forms/steps/CheckNickNameStep.svelte';
	import CheckPasswordStep from '$components/forms/steps/CheckPasswordStep.svelte';
	import MainScreen from '$components/landing/MainScreen.svelte';
	import DownloadBanner from '$components/dispaly/DownloadBanner.svelte';
	import { getApplicationStoreUrl } from '$lib/utils/product';

	$: showHeader = $registrationStep !== 'home' || $activeTab === 'login';
	$: appName = getAppName();
	$: appUrl = getApplicationStoreUrl($app)?.url || '';
</script>

<div
	class="w-full flex flex-col md:flex-row justify-end h-full lg:max-h-[668px] large:min-h-[768px] large:max-h-[768px] 2xl:max-h-[768px]"
>
	<DownloadBanner name={appName} url={appUrl} />
	<div
		class="{showHeader
			? 'bg-white'
			: 'lg:bg-white'} shadow-[0px_0px_52px_0px_rgba(0,0,0,0.08)] md:rounded-3xl flex flex-col w-full lg:w-[400px] xl:w-[504px] md:px-[60px] h-full"
	>
		<FormHeader show={showHeader} />
		{#if $registrationStep === 'nickname' || $activeTab === 'login'}
			<div
				class="flex flex-row w-full items-center justify-center text-sm font-medium leading-5 text-center"
			>
				<div class="flex items-center justify-center w-full box-border">
					<button
						aria-label={$t('Sign up')}
						class="h-10 bg-white w-full box-border tracking-[0.1px] border-b-2 {$activeTab ===
						'register'
							? 'text-primary border-[#0A84FF]'
							: 'border-gray-100 border-b text-disabled-text'} "
						on:click={() => ($activeTab = 'register')}
					>
						{$t('Sign up')}
					</button>
				</div>
				<div
					class="flex items-center justify-center w-full h-10 py-2 box-border border-transparent border-b-2"
				>
					<button
						aria-label={$t('Sign in')}
						class="h-10 bg-white w-full box-border tracking-[0.1px] border-b-2 {$activeTab ===
						'login'
							? 'text-primary border-[#0A84FF]'
							: 'border-gray-100 border-b text-disabled-text'} "
						on:click={() => ($activeTab = 'login')}
					>
						{$t('Sign in')}
					</button>
				</div>
			</div>
		{/if}
		{#if $activeTab === 'register'}
			{#if $registrationStep === 'phone'}
				<CheckPhoneStep />
			{:else if $registrationStep === 'otp' || $registrationStep === 'confirmed'}
				<CheckOtpStep />
			{:else if $registrationStep === 'nickname'}
				<div class="flex p-4 justify-center items-center self-stretch">
					<div class="text-center text-[28px] font-semibold not-italic leading-[36px]">
						{$t('Sign up')}
					</div>
				</div>
				<CheckNickNameStep />
			{:else if $registrationStep === 'password'}
				<CheckPasswordStep />
			{:else}
				<MainScreen />
			{/if}
		{:else}
			<div class="flex p-4 justify-center items-center gap-2 self-stretch">
				<div class="text-center text-[28px] font-semibold not-italic leading-[36px]">
					{$t('Sign in')}
				</div>
			</div>
			<LoginForm />
		{/if}
	</div>
</div>
