<script lang="ts">
	import Confirmed from '$lib/components/icons/ConfirmedIcon.svelte';
	import { t } from 'svelte-i18n';
</script>

<div class="flex p-[16px] flex-col items-center gap-[4px] self-stretch">
	<Confirmed />
	<h1 class="text-center text-[22px] not-italic font-semibold leading-7">
		{$t('Your phone number successfully confirmed')}
	</h1>
</div>
