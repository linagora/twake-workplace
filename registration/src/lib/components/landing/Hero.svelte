<script lang="ts">
	import { t } from 'svelte-i18n';
	import Logo from '$components/logo/Logo.svelte';

	const currentYear = new Date().getFullYear();
</script>

<div
	class="hidden lg:flex flex-col w-full lg:max-w-[506px] px-10 lg:px-0 space-y-6 pt-52 justify-center items-start pb-9"
>
	<div class="flex flex-col h-full justify-center space-y-[47px]">
		<Logo />
		<div class="flex flex-col space-y-5 h-full 4xl:h-auto pr-10">
			<h1
				class="text-[32px] leading-10 not-italic font-semibold lg:leading-[44px] text-center lg:text-left w-full text-disabled-text"
			>
				{$t('welcome')}
			</h1>
		</div>
	</div>
	<div class="pt-auto">
		<span
			class="overflow-hidden text-sm not-italic font-medium leading-5 tracking-[0.1px] text-blueGray px-2"
			>© 2000-{currentYear}, LINAGORA</span
		>
	</div>
</div>
