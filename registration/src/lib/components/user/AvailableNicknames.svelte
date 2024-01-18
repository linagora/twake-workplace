<script lang="ts">
	import { isMobile } from '$lib/utils/device';
	import { clickOutside } from './../../utils/html';
	import { t } from 'svelte-i18n';

	export let value: string;
	export let nickNames: string[];
	export let show: boolean = true;
	export let checked: boolean;

	const setNickName = (val: string) => {
		value = val;
		show = false;
		checked = true;
	};

	$: display = show;

	$: nickNamesList = isMobile() ? nickNames.slice(0, 2) : nickNames;
</script>

{#if display}
	<div class="flex justify-start items-start py-1 w-full px-4">
		<span class="text-error text-[11px] not-italic font-medium leading-4 tracking-[0.5px]"
			>{$t('username_taken')}
		</span>
	</div>
{/if}
{#if nickNames.length > 0 && display}
	<div
		use:clickOutside={() => {
			if (display) display = false;
		}}
		class="flex flex-col lg:absolute lg:z-10 lg:px-4 pt-3 lg:py-3 w-[328px] lg:-mx-1 lg:origin-top-right rounded-2xl bg-white lg:shadow-2xl lg:ring-1 lg:ring-black lg:ring-opacity-5 focus:outline-none"
	>
		<div
			class="hidden lg:flex items-start justify-start overflow-hidden text-disabled-text text-ellipsis text-[22px] not-italic font-semibold leading-7"
		>
			{$t('available-usernames')}
		</div>
		<div
			class="flex lg:hidden overflow-hidden text-blueGray text-ellipsis text-sm not-italic font-medium leading-5 tracking-[0.1px]"
		>
			{$t('available-usernames')}
		</div>
		<div class="flex flex-row lg:flex-col lg:space-y-2 space-x-3 lg:space-x-0 flex-nowrap pt-2">
			{#each nickNamesList as nickName}
				<button
					aria-label="pick {nickName}"
					type="button"
					class="bg-[#E8F0FA] rounded-lg py-[6px] px-4 max-h-8 min-w-fit w-fit text-disabled-text text-center text-sm not-italic font-medium leading-5 tracking-[0.1px]"
					on:click={() => setNickName(nickName)}
				>
					{nickName}
				</button>
			{/each}
		</div>
	</div>
{/if}
