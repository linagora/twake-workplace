<script lang="ts">
	import Logo from '../logo/Logo.svelte';
	import { t } from 'svelte-i18n';
</script>

<div class="flex flex-col space-y-8 font-[Inter] px-10 pt-20 w-full max-w-xl">
	<Logo />
	<div class="flex flex-col space-y-5 w-full">
		<h1 class="text-4xl text-black font-semibold leading-[52px] tracking-normal text-left;">
			{$t('logged_hero')}
		</h1>
		<div class="hidden lg:flex flex-row gap-[50.2px]">
			<img src="/images/twakechat.svg" alt="twake" class="w-[88px] h-[88px]" />
			<img src="/images/tdrive.svg" alt="tdrive" class="w-[88px] h-[88px]" />
			<img src="/images/tmail.svg" alt="tmail" class="w-[88px] h-[88px]" />
		</div>
	</div>
</div>
