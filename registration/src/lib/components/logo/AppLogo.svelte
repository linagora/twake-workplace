<script lang="ts">
	import { app } from '../../../store';
	import ChatLogo from './apps/chat/ChatLogo.svelte';
	import TdriveLogo from './apps/tdrive/TdriveLogo.svelte';
	import TmailLogo from './apps/tmail/TmailLogo.svelte';
	import TwakeWorkplaceLogo from './apps/workplace/TwakeWorkplaceLogo.svelte';
</script>

{#if $app === 'chat'}
	<ChatLogo />
{:else if $app === 'tdrive'}
	<TdriveLogo />
{:else if $app === 'tmail'}
	<TmailLogo />
{:else}
	<TwakeWorkplaceLogo />
{/if}

