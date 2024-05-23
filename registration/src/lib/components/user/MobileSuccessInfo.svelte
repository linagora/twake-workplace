<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { t } from 'svelte-i18n';
	import MobileLogout from './MobileLogout.svelte';
	import CopyIcon from '../icons/CopyIcon.svelte';
	import { copyToClipboard } from '$utils/clipboard';
	import Toast from '../display/Toast.svelte';
	import DeleteAccountButton from '../buttons/DeleteAccountButton.svelte';

	export let firstName: string;
	export let lastName: string;
	export let username: string;
	export let phone: string | null;
	export let email: string | undefined;

	let showToast: boolean = false;

	const handleCopy = () => {
		copyToClipboard(matrixId)
			.then(() => {
				showToast = true;

				setTimeout(() => {
					showToast = false;
				}, 2000);
			})
			.catch(console.error);
	};

	$: suffix = `@${env.PUBLIC_SIGNUP_EMAIL_DOMAIN}`;
	$: matrixId = `@${username}:${env.PUBLIC_SIGNUP_EMAIL_DOMAIN}`;
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
					{`${firstName} ${lastName}`}!
				</h1>
			</div>
			<MobileLogout />
		</div>
		<div class="flex flex-col gap-0.5 px-4">
			<div class="flex space-x-5">
				<span
					class="text-[17px] not-italic font-normal leading-6 tracking-[-0.15px] text-disabled-text text-left"
					>{matrixId}</span
				>
				<button type="button" on:click={handleCopy} class="cursor-pointer hover:text-gray-300">
					<CopyIcon />
				</button>
			</div>
			<span class="text-sm font-normal leading-5 text-left text-gray-500"
				>{$t('twake-matrix-id')}</span
			>
		</div>
		<div class="flex flex-col gap-0.5 px-4">
			<span
				class="text-[17px] not-italic font-normal leading-6 tracking-[-0.15px] text-disabled-text text-left"
				>{email ?? `${username}${suffix}`}</span
			>
			<span class="text-sm font-normal leading-5 text-left text-gray-500">{$t('twake-mail')}</span>
		</div>
		{#if phone}
			<div class="flex flex-col gap-0.5 px-4">
				<span
					class="text-[17px] not-italic font-normal leading-6 tracking-[-0.15px] text-disabled-text text-left"
					>{phone}</span
				>
				<span class="text-sm font-normal leading-5 text-left text-gray-500"
					>{$t('twake-phone-number')}</span
				>
			</div>
		{/if}
		<div
			class="px-2 text-[17px] not-italic font-normal leading-6 tracking-[-0.15px] text-disabled-text text-left 0"
		>
			<DeleteAccountButton {username} />
		</div>
	</div>
	<span
		class="text-center text-[17px] not-italic font-medium leading-6 tracking-[-0.15px] text-disabled-text"
	>
		{$t('logged_twakeid_choose_mobile')}
	</span>
</div>
<Toast show={showToast}>{$t('matrix-id-copied')}</Toast>
