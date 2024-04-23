<script lang="ts">
	import Spinner from '$components/icons/SpinnerIcon.svelte';

	export let disabled: boolean = false;
	export let handler: () => void = () => {};
	export let ariaLabel: string = '';
	export let loading: boolean = false;
</script>

<button
	type="button"
	aria-label={ariaLabel}
	{disabled}
	on:click={handler}
	class="flex items-center rounded-full justify-center w-full h-12 {disabled
		? 'bg-slate-200 text-slate-400'
		: 'bg-primary text-white'} text-sm font-medium leading-5 tracking-wide text-center"
>
	<slot />

	{#if loading}
		<span class="flex items-center px-1 text-white">
			<Spinner />
		</span>
	{/if}
</button>
