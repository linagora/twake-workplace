<script lang="ts">
	import { showBanner } from '$store';
	import DownloadButton from '$components/buttons/DownloadButton.svelte';
	import CloseIcon from '$components/icons/CloseIcon.svelte';
	import AppLogo from '$components/logo/AppLogo.svelte';
	import { t } from 'svelte-i18n';

	export let name: string;
	export let url: string;
	export let show: boolean;

	const hideBanner = () => {
		showBanner.set(false);
	};
</script>

{#if show}
	<div class="absolute lg:hidden top-4 px-3 w-full z-50">
		<div class="w-full h-[105px] banner rounded-[10px] [shadow-box:0px] relative">
			<button
				type="button"
				class="w-[24px] h-[24px] absolute right-[7px] top-[6px]"
				on:click={hideBanner}
			>
				<CloseIcon />
			</button>
			<div class="flex flex-row items-center h-full w-full">
				<button class="px-3 shrink-0">
					<AppLogo type="icon" />
				</button>
				<div class="flex flex-col h-full space-y-2 pt-6 grow">
					<div
						class="flex flex-col justify-center text-[16px] font-medium not-italic leading-[20px]"
					>
						{$t('download-app', { values: { name } })}
					</div>
					<div class="text-black text-[13px] not-italic leading-[16px]">
						{$t('Faster-and-more-convenient')}
					</div>
				</div>
				<DownloadButton {url} />
			</div>
		</div>
	</div>
{/if}

<style>
	.banner {
		background: linear-gradient(0deg, rgba(122, 184, 255, 0.09) 0%, rgba(122, 184, 255, 0.09) 100%),
			#fffbfe;
	}
</style>
