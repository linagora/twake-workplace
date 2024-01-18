<script lang="ts">
	export let disabled: boolean = false;
	export let handler: () => void = () => {};
	export let ariaLabel: string = '';
</script>

<button
	type="button"
	aria-label={ariaLabel}
	{disabled}
	on:click={handler}
	class="flex items-center rounded-full justify-center w-full h-12 {disabled
		? 'bg-slate-200 text-slate-400'
		: 'bg-primary text-white'} text-base font-medium leading-5 tracking-wide text-center"
>
	<slot />
</button>
