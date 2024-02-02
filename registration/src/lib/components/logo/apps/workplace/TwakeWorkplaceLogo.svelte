<script lang="ts">
	import type { LogoType } from '../../../../../types';
	import Header from './WorkplaceHeader.svelte';
	import Landing from './WorkspalaceLanding.svelte';

	export let type: LogoType = 'header';
</script>

{#if type === 'header'}
	<Header />
{:else}
	<Landing />
{/if}
