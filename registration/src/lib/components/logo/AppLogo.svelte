<script lang="ts">
	import { app } from '$store';
	import type { LogoType } from '$types';
	import ChatLogo from './apps/chat/ChatLogo.svelte';
	import TdriveLogo from './apps/tdrive/TdriveLogo.svelte';
	import TmailLogo from './apps/tmail/TmailLogo.svelte';
	import TwakeWorkplaceLogo from './apps/workplace/TwakeWorkplaceLogo.svelte';

	export let type: LogoType = 'header';
</script>

{#if $app === 'chat'}
	<ChatLogo {type} />
{:else if $app === 'tdrive'}
	<TdriveLogo {type} />
{:else if $app === 'tmail'}
	<TmailLogo {type} />
{:else}
	<TwakeWorkplaceLogo {type} />
{/if}
