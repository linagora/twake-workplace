<script lang="ts">
	import { t } from 'svelte-i18n';
	import { attemptToOpenApp } from '$utils/url';

	const open = () => {
		attemptToOpenApp('tdrive');
	};
</script>

<button
	on:click={open}
	type="button"
	class="flex flex-row space-x-5 bg-gray-100 p-5 rounded-3xl w-full cursor-pointer"
>
	<div class="shrink items-center justify-center">
		<img src="/images/tdrive.svg" alt="tdrive" class="h-14 w-14" />
	</div>
	<div class="flex flex-col gap-1 w-full items-start justify-start">
		<h1 class="hidden lg:block text-[22px] not-italic font-semibold leading-7 text-left text-black">
			Drive
		</h1>
		<h1
			class="lg:hidden text-center text-base not-italic font-semibold leading-6 tracking-[0.15px] text-disabled-text"
		>
			Drive
		</h1>
		<span
			class="text-xs not-italic font-medium leading-4 tracking-[0.4px] text-coolgray-400 text-left lg:pr-10"
			>{$t('tdrive_description')}</span
		>
	</div>
	<button
		aria-label="open tdrive"
		type="button"
		class="flex shrink items-center justify-center"
	>
		<img src="/images/arrow-forward.svg" alt="next" class="w-6" />
	</button>
</button>
