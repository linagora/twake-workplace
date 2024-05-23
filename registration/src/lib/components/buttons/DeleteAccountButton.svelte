<script lang="ts">
	import { t } from 'svelte-i18n';
	import { sendAccountDeletionMail } from '$utils/account';
	import DeleteAccountIcon from '$components/icons/DeleteAccountIcon.svelte';

  export let username: string;
</script>

<button
	type="button"
	on:click={() => sendAccountDeletionMail(username)}
	class="w-full flex items-center text-disabled-text gap-5 justify-start p-2.5 text-sm transition-colors duration-200 transform hover:bg-red-300"
>
	<DeleteAccountIcon />

	<div class="mx-1 grow text-left">
		<h1 class="text-sm font-semibold">{$t('delete-account')}</h1>
	</div>
</button>
