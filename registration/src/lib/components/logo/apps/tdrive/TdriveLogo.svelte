<script lang="ts">
	import type { LogoType } from '../../../../../types';
	import Header from './TdriveHeader.svelte';
	import Landing from './TdriveLanding.svelte';

	export let type: LogoType = 'header';
</script>

{#if type === 'header'}
	<Header />
{:else}
	<Landing />
{/if}
