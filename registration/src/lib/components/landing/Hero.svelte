<script lang="ts">
	import { t } from 'svelte-i18n';
	import Logo from '$components/logo/Logo.svelte';

	const currentYear = new Date().getFullYear();
</script>

<div
	class="hidden lg:flex flex-col w-full lg:max-w-[508px] px-10 lg:px-0 space-y-6 pt-52 items-center lg:items-start pb-9"
>
	<Logo />
	<div class="flex flex-col space-y-5 w-full h-screen lg:h-full">
		<h1
			class="text-2xl leading-8 lg:text-3xl xl:text-4xl not-italic font-semibold lg:leading-[44px] text-center lg:text-left w-full text-disabled-text"
		>
			{$t('welcome')}
		</h1>
	</div>
	<div class="pt-auto">
		<span
			class="overflow-hidden text-sm not-italic font-medium leading-5 tracking-[0.1px] text-blueGray px-2"
			>© 2000-{currentYear}, LINAGORA</span
		>
	</div>
</div>
