<script lang="ts">
	import type { LogoType } from '$types';
	import Header from './TmailHeader.svelte';
	import Landing from './TmailLanding.svelte';

	export let type: LogoType = 'header';
</script>

{#if type === 'header'}
	<div class="h-8 w-48">
		<Header />
	</div>
{:else}
	<Landing />
{/if}
