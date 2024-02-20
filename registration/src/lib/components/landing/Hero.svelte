<script lang="ts">
	import { t } from 'svelte-i18n';
	import Logo from '$components/logo/Logo.svelte';
</script>

<div
	class="hidden lg:flex flex-col w-full lg:max-w-[508px] px-10 lg:px-0 space-y-6 font-[Inter] pt-52 items-center lg:items-start"
>
	<Logo />
	<div class="flex flex-col space-y-5 w-full h-screen lg:h-fit">
		<h1
			class="text-2xl leading-8 lg:text-4xl not-italic font-semibold lg:leading-[44px] text-center lg:text-left w-full text-disabled-text"
		>
			{$t('welcome')}
		</h1>
		<a
			href="#start"
			class=" lg:hidden flex items-center rounded-full justify-center w-full h-12 bg-blue-500 text-base font-medium leading-5 tracking-wide text-center text-white"
		>
			{$t('Start your journey')}
		</a>
	</div>
</div>
