<script lang="ts">
	import NavigateBack from '$lib/components/button/NavigateBack.svelte';
	import AppLogo from '$lib/components/logo/AppLogo.svelte';

	export let logo: boolean = true;
</script>

<div class="flex flex-row">
	<NavigateBack />
	{#if logo}
		<div class="flex p-0 flex-col justify-center items-center self-stretch w-full">
			<div class="flex w-full p-[12px] flex-col items-center gap-[10px]">
				<AppLogo />
			</div>
		</div>
	{/if}
</div>
