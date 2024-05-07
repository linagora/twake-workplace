<script lang="ts">
	import { t } from 'svelte-i18n';
	import { attemptToOpenApp, openRedirectLink } from '$lib/utils/url';
	import { redirectUrl as redirectUrlStore } from '$store';
	import { getApplicationGotoLink } from '$src/lib/utils/product';

	const open = () => {
		$redirectUrlStore ? openRedirectLink($redirectUrlStore, 'tdrive') : attemptToOpenApp('tdrive');
	};

	const webUrl = getApplicationGotoLink('tdrive');

	$: displayUrl = new URL(webUrl).hostname;
</script>

<div class="flex flex-row space-x-5 bg-gray-100 p-5 rounded-3xl w-full">
	<div class="shrink items-center justify-center">
		<img src="/images/tdrive.svg" alt="tdrive" class="h-full" />
	</div>
	<div class="flex flex-col gap-1 w-full items-start justify-start">
		<h1 class="hidden lg:block text-[22px] not-italic font-semibold leading-7 text-left text-black">
			Drive
		</h1>
		<h1
			class="lg:hidden text-center text-base not-italic font-semibold leading-6 tracking-[0.15px] text-disabled-text"
		>
			Drive (web)
		</h1>
		<span
			class="hidden lg:block text-xs not-italic font-medium leading-4 tracking-[0.4px] text-coolgray-400 text-left lg:pr-10"
			>{$t('tdrive_description')}</span
		>
		<span
			class="lg:hidden text-xs not-italic font-medium leading-4 tracking-[0.4px] text-primary text-left"
			>{displayUrl}</span
		>
	</div>
	<button
		aria-label="open tdrive"
		type="button"
		on:click={open}
		class="flex shrink items-center justify-center"
	>
		<img src="/images/arrow-forward.svg" alt="next" class="w-6" />
	</button>
</div>
