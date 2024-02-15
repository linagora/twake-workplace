<script lang="ts">
	import { enhance } from '$app/forms';
	import PrimaryButton from '$lib/components/button/PrimaryButton.svelte';
	import TextField from '$lib/components/input/TextField.svelte';
	import AvailableNicknames from '$lib/components/user/AvailableNicknames.svelte';
	import { createUserFormSchema } from '$lib/schemas/zodSchema';
	import { isNickNameTaken, suggestNickNames } from '$lib/utils/api';
	import { t } from 'svelte-i18n';

	let firstName: string = '';
	let lastName: string = '';
	let nickName: string = '';
	let nickNamechecked = false;
	let nickNameTaken = false;
	let loading = false;
	let accepted = false;
	let alternativeNicknames: string[] = [];
	let checkNicknameForm: HTMLFormElement;

	$: validNickName = nickName.length > 0 && nickNamechecked && !nickNameTaken;

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
		}).success || nickNameTaken;

	const handler = async () => {
		if (disabled) return;

		checkNicknameForm.requestSubmit();
	};
</script>

<form use:enhance action="?/sendOtp" method="POST" class="hidden" bind:this={checkNicknameForm}>
	<input type="text" name="nickname" bind:value={nickName} required />
	<input type="text" name="firstName" bind:value={firstName} required />
	<input type="text" name="lastName" bind:value={lastName} required />
</form>

<div class="flex flex-col px-4 lg:px-0 lg:h-fit min-h-[768px]">
	<div class="flex py-[16px] flex-col items-start gap-[24px] self-stretch">
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
			onBlur={checkNickName}
			feedback={validNickName}
			onInput={invalidateNickNameCheck}
			{loading}
			suffix="@twake.app"
			info={true}
			infoTitle={$t('Matrix ID/Email')}
			infoDescription={$t('username_info_tooltip')}
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

		<div class="hidden lg:block w-[386px] h-[146px]" />
	</div>
	<div class="flex flex-col lg:mt-auto gap-4 space-y-4 py-4">
		<PrimaryButton ariaLabel="next" {disabled} {handler}>{$t('Next')}</PrimaryButton>
		<div class="flex items-start gap-[8px] self-stretch">
			<input
				type="checkbox"
				bind:checked={accepted}
				class="mt-1 form-checkbox h-6 w-6 focus:ring-0 rounded"
				name="accept"
				aria-label={$t('accept terms and conditions')}
			/>
			<span class="flex-[1_0_0] text-[14px] font-medium tracking-[0px]">{@html $t('uela')}</span>
		</div>
	</div>
</div>
