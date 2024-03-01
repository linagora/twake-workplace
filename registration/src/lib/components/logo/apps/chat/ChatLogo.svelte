<script lang="ts">
	import type { LogoType } from '$types';
	import Header from './ChatHeader.svelte';
	import Landing from './ChatLanding.svelte';
	import Icon from './ChatIcon.svelte';

	export let type: LogoType = 'header';
</script>

{#if type === 'header'}
	<div class="h-8 w-48">
		<Header />
	</div>
{:else if type === 'icon'}
	<div class="h-[47px] w-[47px]">
		<Icon />
	</div>
{:else}
	<Landing />
{/if}
