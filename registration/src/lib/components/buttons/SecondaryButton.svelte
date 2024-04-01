<script lang="ts">
	export let handler: () => void = () => {};
	export let disabled: boolean = false;
	export let ariaLabel: string = '';
</script>

<button
	type="button"
	aria-label={ariaLabel}
	on:click={handler}
	{disabled}
	class="flex justify-center bg-[#f4f4f4] items-center self-stretch rounded-[100px] shadow w-full"
>
	<div class="px-6 py-3.5 justify-center items-center flex">
		<div class="text-center text-primary text-sm font-medium leading-tight tracking-tight">
			<slot />
		</div>
	</div>
</button>
