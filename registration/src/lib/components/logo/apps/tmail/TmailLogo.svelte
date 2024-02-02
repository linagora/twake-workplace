<script lang="ts">
	import type { LogoType } from '../../../../../types';
	import Header from './TmailHeader.svelte';
	import Landing from './TmailLanding.svelte';

	export let type: LogoType = 'header';
</script>

{#if type === 'header'}
	<Header />
{:else}
	<Landing />
{/if}
