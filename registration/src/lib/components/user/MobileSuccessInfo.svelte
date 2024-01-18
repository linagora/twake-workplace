<script lang="ts">
	import OutlineButton from '../button/OutlineButton.svelte';
	import { t } from 'svelte-i18n';

	export let user: string;
	export let id: string;
	export let phone: string;
</script>

<div
	class="flex flex-col space-y-4 items-center justify-center text-sm font-medium leading-5 tracking-wide text-center w-full"
>
	<div class="bg-gray-100 rounded-2xl flex flex-col space-y-3 pb-5 w-full">
		<div class="flex flex-row w-full px-4 py-4">
			<img src="/images/avatar.svg" alt="avatar" class="w-12" />
			<div class="flex flex-col px-4 gap-0 items-start grow">
				<h1 class="text-xl font-semibold tracking-normal">{$t('Congratulations')},</h1>
				<h1 class="text-xl font-semibold tracking-normal">
					{user}!
				</h1>
			</div>
			<img src="/images/arrow-forward.svg" alt="next" />
		</div>
		<div class="flex flex-col gap-0.5 px-4">
			<span class="text-[17px] not-italic font-normal leading-6 tracking-[-0.15px] text-disabled-text text-left">@{id}</span>
			<span class="text-sm font-normal leading-5 text-left text-gray-500">{ $t('twake-matrix-id') }</span>
		</div>
		<div class="flex flex-col gap-0.5 px-4">
			<span class="text-[17px] not-italic font-normal leading-6 tracking-[-0.15px] text-disabled-text text-left">{id}@twake.app</span>
			<span class="text-sm font-normal leading-5 text-left text-gray-500">{ $t('twake-mail') }</span>
		</div>
		{#if phone}
			<div class="flex flex-col gap-0.5 px-4">
				<span class="text-[17px] not-italic font-normal leading-6 tracking-[-0.15px] text-disabled-text text-left">{phone}</span>
				<span class="text-sm font-normal leading-5 text-left text-gray-500">{ $t('twake-phone-number') }</span
				>
			</div>
		{/if}

		<div class="flex items-center justify-center pt-5">
			<div class="w-4/5 md:hidden">
				<OutlineButton disabled={true} handler={() => {}}>{ $t('add-recovery-email') }</OutlineButton>
			</div>
		</div>
	</div>
	<span class="text-center text-[17px] not-italic font-medium leading-6 tracking-[-0.15px] text-disabled-text">
		{ $t('logged_twakeid_choose_mobile') }
	</span>
</div>
