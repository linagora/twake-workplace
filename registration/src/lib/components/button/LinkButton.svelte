<script lang="ts">
	export let handler: () => void = () => {};
	export let disabled: boolean = false;
	export let ariaLbel: string = '';
</script>

<button
	type="button"
	on:click={handler}
	{disabled}
	aria-label={ariaLbel}
	class="flex p-[12px] justify-center items-center gap-[8px] self-stretch"
>
	<div
		class="text-center text-[17px] font-medium tracking-[0px] underline not-italic leading-[24px] text-primary"
	>
		<slot />
	</div>
</button>
