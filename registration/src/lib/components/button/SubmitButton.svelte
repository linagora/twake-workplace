<script lang="ts">
	export let disabled: boolean = false;
	export let ariaLabel: string = '';
</script>

<button
	type="submit"
	aria-label={ariaLabel}
	{disabled}
	class="flex items-center rounded-full justify-center w-full h-12 {disabled
		? 'bg-disabled text-[#1C1B1F] text-opacity-[0.38]'
		: 'bg-primary text-white'} text-center text-sm not-italic font-medium leading-5 tracking-[0.1px]"
>
	<slot />
</button>
