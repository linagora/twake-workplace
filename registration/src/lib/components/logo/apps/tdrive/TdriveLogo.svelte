<script lang="ts">
	import type { LogoType } from '../../../../../types';
	import Header from './TdriveHeader.svelte';
	import Landing from './TdriveLanding.svelte';

	export let type: LogoType = 'header';
</script>

{#if type === 'header'}
	<div class="h-8 w-48">
		<Header />
	</div>
{:else}
	<Landing />
{/if}
