<script lang="ts">
	import Spinner from '$components/icons/SpinnerIcon.svelte';

	export let disabled: boolean = false;
	export let ariaLabel: string = '';
	export let loading: boolean = false;
</script>

<button
	type="submit"
	aria-label={ariaLabel}
	{disabled}
	class="flex items-center rounded-full justify-center w-full h-12 {disabled
		? 'bg-slate-200 text-slate-400'
		: 'bg-primary text-white'} text-center text-sm not-italic font-medium leading-5 tracking-[0.1px] space-x-5"
>
	<slot />
	{#if loading}
		<span class="flex items-center px-1 text-white">
			<Spinner />
		</span>
	{/if}
</button>
