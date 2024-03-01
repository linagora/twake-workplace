<script lang="ts">
	import type { LogoType } from '$types';
	import Header from './WorkplaceHeader.svelte';
	import Landing from './WorkspalaceLanding.svelte';
	import Icon from './WorkplaceIcon.svelte';

	export let type: LogoType = 'header';
</script>

{#if type === 'header'}
	<div class="w-[195px] h-[36px] p-px flex items-center justify-center">
		<Header />
	</div>
{:else if type === 'icon'}
	<Icon />
{:else}
	<Landing />
{/if}
