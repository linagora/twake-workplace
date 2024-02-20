<script lang="ts">
	import type { LogoType } from '../../../../../types';
	import Header from './ChatHeader.svelte';
	import Landing from './ChatLanding.svelte';

	export let type: LogoType = 'header';
</script>

{#if type === 'header'}
	<div class="h-8 w-48">
		<Header />
	</div>
{:else}
	<Landing />
{/if}
