<script lang="ts">
	import { t } from 'svelte-i18n';

	export let user: string;
</script>

<div
	class="flex flex-col space-y-4 w-full items-center justify-center text-sm font-medium leading-5 tracking-wide text-center"
>
	<div class="flex flex-col text-center text-[28px] not-italic font-semibold leading-9 text-[#1C1B1F]">
		<h1 class="px-12">
			{$t('Congratulations')},
		</h1>
		<h1 class="px-12">
			{user}!
		</h1>
	</div>

	<span class="text-center text-[17px] not-italic font-medium leading-6 tracking-[-0.15px] text-[#818C99]"
		>{$t('You are all set up')}</span
	>
	<span class="text-center text-[17px] not-italic font-medium leading-6 tracking-[-0.15px] text-[#313033]"
		>{$t('logged_twakeid_choose')}</span
	>
</div>
