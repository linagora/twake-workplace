<script lang="ts">
	import { enhance } from '$app/forms';
	import PrimaryButton from '$components/buttons/PrimaryButton.svelte';
	import TextField from '$components/input/TextField.svelte';
	import AvailableNicknames from '$components/user/AvailableNicknames.svelte';
	import { env } from '$env/dynamic/public';
	import { createUserFormSchema } from '$lib/schemas/zodSchema';
	import { nickNameStepInfo } from '$store';
	import { isNickNameTaken, suggestNickNames } from '$utils/api';
	import { onDestroy, onMount } from 'svelte';
	import { t } from 'svelte-i18n';

	let firstName: string = '';
	let lastName: string = '';
	let nickName: string = '';
	let nickNamechecked = false;
	let nickNameTaken = false;
	let loading = false;
	let accepted = true;
	let alternativeNicknames: string[] = [];
	let checkNicknameForm: HTMLFormElement;
	let formLoading = false;

	$: validNickName = nickName.length > 0 && nickNamechecked && !nickNameTaken;
	$: suffix = `@${env.PUBLIC_SIGNUP_EMAIL_DOMAIN}`;

	const invalidateNickNameCheck = () => {
		nickNamechecked = false;
		nickNameTaken = false;
	};

	const checkNickName = async () => {
		if (!nickName || nickNamechecked) return;

		loading = true;
		alternativeNicknames = [];
		nickNameTaken = false;
		nickNamechecked = true;
		await new Promise((resolve) => setTimeout(resolve, 100));

		const result = await isNickNameTaken(nickName);

		if (result && firstName && lastName) {
			alternativeNicknames = await suggestNickNames(firstName, lastName);
			nickNamechecked = false;
		}

		loading = false;
		nickNameTaken = result;
	};

	$: disabled =
		!createUserFormSchema.safeParse({
			firstName,
			lastName,
			nickName,
			accepted
		}).success ||
		nickNameTaken ||
		formLoading ||
		!nickNamechecked;

	const handler = async () => {
		if (disabled) return;

		checkNicknameForm.requestSubmit();
	};

	onMount(() => {
		const {
			firstName: savedFirstName,
			lastName: savedLastName,
			nickName: savedNickname
		} = $nickNameStepInfo;

		firstName = savedFirstName;
		lastName = savedLastName;
		nickName = savedNickname;
  
		checkNickName();
	});

	onDestroy(() => { 
		nickNameStepInfo.set({
			firstName,
			lastName,
			nickName
		});
	});
</script>

<form
	action="?/checkNickName"
	method="POST"
	class="hidden"
	autocomplete="off"
	bind:this={checkNicknameForm}
	use:enhance={() => {
		formLoading = true;

		return async ({ update }) => {
			formLoading = false;

			update();
		};
	}}
>
	<input type="text" name="nickname" bind:value={nickName} required />
	<input type="text" name="firstName" bind:value={firstName} required />
	<input type="text" name="lastName" bind:value={lastName} required />
</form>

<div class="flex flex-col px-4 lg:px-0 h-full pb-[28px] lg:pb-6">
	<div class="flex flex-col items-start gap-6 self-stretch">
		<TextField
			name="firstname"
			placeholder={$t('First Name')}
			label={$t('First Name')}
			bind:value={firstName}
			isInValid={false}
			feedback={false}
		/>

		<TextField
			name="lastname"
			placeholder={$t('Last Name')}
			label={$t('Last Name')}
			bind:value={lastName}
			isInValid={false}
			feedback={false}
		/>

		<TextField
			name="nickname"
			placeholder={$t('Username')}
			label={$t('Matrix ID/Email')}
			bind:value={nickName}
			isInValid={!createUserFormSchema.safeParse({ nickName }).success || nickNameTaken}
			feedback={validNickName}
			onInput={invalidateNickNameCheck}
			{loading}
			{suffix}
			info={true}
			infoTitle={$t('Matrix ID/Email')}
			infoDescription={$t('username_info_tooltip')}
			onStopTyping={checkNickName}
		/>
		{#if nickNameTaken === true}
			<AvailableNicknames
				bind:value={nickName}
				nickNames={alternativeNicknames}
				bind:show={nickNameTaken}
				bind:checked={nickNamechecked}
			/>
		{:else if nickName.length && !createUserFormSchema.safeParse({ nickName }).success}
			<span class="text-xs font-medium leading-4 tracking-wide text-left text-error px-5"
				>{$t('invalid Username')}
			</span>
		{/if}
	</div>
	<div class="flex flex-col lg:mt-auto gap-4 space-y-4 py-4">
		<PrimaryButton ariaLabel="next" {disabled} {handler} loading={formLoading}
			>{$t('Next')}</PrimaryButton
		>
		<div class="flex items-start gap-[8px] self-stretch">
			<input
				type="checkbox"
				bind:checked={accepted}
				class="mt-1 form-checkbox h-[18px] w-[18px] focus:ring-0 rounded"
				name="accept"
				aria-label={$t('accept terms and conditions')}
			/>
			<span class="flex-[1_0_0] text-[14px] font-medium tracking-[0px]">{@html $t('uela')}</span>
		</div>
	</div>
</div>
