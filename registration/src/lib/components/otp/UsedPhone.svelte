<script lang="ts">
	import { activeTab } from '../../../store';
	import { t } from 'svelte-i18n';

	export let checked: boolean = false;

	$: show = checked;
</script>

{#if show}
	<div
		class="hidden lg:block text-black text-[11px] not-italic font-medium leading-4 tracking-[0.5px] text-left w-full px-4 p-1"
	>
		{$t('Number is already registered')}
		<button
			aria-label={$t('sign-in-instead')}
			type="button"
			on:click={() => ($activeTab = 'login')}
			class="text-primary"
			>{$t('Sign in')}
		</button>
		{$t('instead')}
	</div>
	<div
		id="alert-5"
		class="lg:hidden absolute z-10 top-2 origin-top-right flex items-center p-3 rounded bg-[#313033] w-full pl-4 py-[10px] left-6 -mx-6"
		role="alert"
	>
		<div class="ms-3 text-sm font-medium text-gray-800 dark:text-gray-300 w-9/12 text-left">
			{ $t('this-number-is-already-registered-sign-in-instead') }
		</div>
		<button
			aria-label={ $t('sign-in-instead') }
			on:click={() => ($activeTab = 'login')}
			type="button"
			class="flex items-center w-4/12 justify-center px-3 py-[10px] text-[#9BC8FF] text-center text-sm not-italic font-medium leading-5 tracking-[0.1px]"
		>
			{ $t('Sign in') }
		</button>
		<button
			type="button"
			on:click={() => (show = false)}
			class="ms-auto -mx-1.5 -my-1.5 text-gray-500 rounded-lg inline-flex items-center justify-center h-8 w-8"
			data-dismiss-target="#alert-5"
			aria-label="Close"
		>
			<span class="sr-only">Dismiss</span>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
			>
				<path
					d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
					fill="#F4EFF4"
				/>
			</svg>
		</button>
	</div>
{/if}
