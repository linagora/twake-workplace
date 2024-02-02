<script lang="ts">
	import type { LogoType } from '../../../../../types';
	import Header from './ChatHeader.svelte';
	import Landing from './ChatLanding.svelte';

	export let type: LogoType = 'header';
</script>

{#if type === 'header'}
	<Header />
{:else}
	<Landing />
{/if}
