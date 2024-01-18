<script lang="ts">
	import { t } from 'svelte-i18n';

	export let show: boolean = false;
	export let title: string;
	export let description: string;
</script>

<div class="flex flex-col text-left text-gray-600 truncate space-y-4 lg:space-y-2">
	<h1
		class="text-2xl not-italic font-semibold leading-8 text-disabled-text lg:text-[17px] lg:not-italic lg:font-bold lg:leading-6 lg:tracking-[-0.15px]"
	>
		{title}
	</h1>

	<span
		class="text-disabled-text text-sm not-italic font-medium leading-5 tracking-[0.25px] whitespace-break-spaces"
	>
		{description}
	</span>

	<button
		aria-label="close dialog"
		type="button"
		class="px-3 py-2 flex items-end justify-end lg:items-start lg:justify-start"
		on:click={() => (show = false)}
	>
		<span
			class="text-primary text-center text-sm not-italic font-medium leading-5 tracking-[0.1px]"
		>
			{ $t('Ok-got-it') }
		</span>
	</button>
</div>
