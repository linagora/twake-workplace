<script lang="ts">
	import TooltipContent from './TooltipContent.svelte';
	export let title: string;
	export let description: string;
	export let show: boolean = false;
</script>

{#if show}
	<div
		class="hidden lg:block absolute w-full px-4 max-w-full pt-3 pb-2 z-10 ml-2 -translate-x-1/2 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.30),0px_2px_6px_2px_rgba(0,0,0,0.15)] -top-40 left-1/2 bg-gray-100 rounded-xl"
	>
		<TooltipContent {title} {description} bind:show />
	</div>
	<div
		class="relative z-20 lg:hidden overflow-hidden overscroll-none"
		aria-labelledby="modal-title"
		role="dialog"
		aria-modal="true"
	>
		<div
			class="fixed inset-0 bg-[#484649] bg-opacity-60 transition-opacity overflow-y-hidden min-h-screen"
		/>

		<div
			class="fixed inset-0 z-10 w-screen overscroll-none overflow-y-hidden min-h-screen flex items-center justify-center px-8"
		>
			<div class="w-full max-w-full dialog rounded-xl p-6">
				<TooltipContent {title} {description} bind:show />
			</div>
		</div>
	</div>
{/if}

<style lang="css">
	.dialog {
		background: linear-gradient(0deg, rgba(116, 116, 128, 0.08) 0%, rgba(116, 116, 128, 0.08) 100%),
			#f2f2f2;
	}
</style>
