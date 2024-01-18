<script lang="ts">
	import UsedPhone from './../otp/UsedPhone.svelte';
	import TextField from '../input/TextField.svelte';
	import PasswordField from '../input/PasswordField.svelte';
	import PhoneField from '../input/PhoneField.svelte';
	import SubmitButton from '../button/SubmitButton.svelte';
	import VerifyPhoneModal from '../otp/VerifyPhoneModal.svelte';
	import { form, phone as phoneStore, verified } from '../../../store';
	import { enhance } from '$app/forms';
	import AvailableNicknames from '../user/AvailableNicknames.svelte';
	import { createUserFormSchema, fullCreateUserFormSchema } from '$lib/schemas/zodSchema';
	import { isNickNameTaken, isPhoneTaken, suggestNickNames } from '$lib/utils/api';
	import { t } from 'svelte-i18n';

	let password = '';
	let confirmPassword = '';
	let firstName = '';
	let lastName = '';
	let nickName = '';
	let phone = '';
	let accepted = false;
	let disabled = true;
	let alternativeNicknames: string[] = [];
	let loading = false;
	let nickNameTaken = false;
	let nickNamechecked = false;
	let phoneTaken = false;
	let loadingPhone = false;
	let phoneChecked = false;

	$: !!phone && phoneStore.set(phone);
	$: invalidPhone = !createUserFormSchema.safeParse({ phone }).success || phoneTaken;
	$: invalidPhoneFormat = phone && !createUserFormSchema.safeParse({ phone }).success;

	$: {
		if ($form?.nickname_taken === true) nickNameTaken = true;
	}

	$: disabled =
		!fullCreateUserFormSchema.safeParse({
			firstName,
			lastName,
			nickName,
			phone,
			password,
			confirmPassword,
			accepted
		}).success ||
		nickNameTaken ||
		phoneTaken ||
		!$verified;

	$: validNickName = nickName.length > 0 && nickNamechecked && !nickNameTaken;

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

	const checkPhone = async () => {
		if (!createUserFormSchema.safeParse({ phone }).success || phoneChecked) return;

		loadingPhone = true;
		phoneChecked = true;
		phoneTaken = await isPhoneTaken(phone);

		loadingPhone = false;
	};

	const invalidateNickNameCheck = () => {
		nickNamechecked = false;
		nickNameTaken = false;
	};
	const invalidatePhoneCheck = () => {
		phoneChecked = false;
		phoneTaken = false;
	};
</script>

<form
	use:enhance
	action="?/register"
	method="POST"
	class="flex flex-col space-y-4 px-4 py-3 xl:px-3 lg:space-y-4 font-[Inter] w-full"
>
	<div class="flex flex-col lg:flex-row lg:space-x-3 space-y-4 lg:space-y-0 w-full">
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
	</div>
	<div class="w-full">
		<TextField
			name="nickname"
			placeholder={$t('Username')}
			label={$t('Username')}
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
	</div>

	<PasswordField
		name="password"
		placeholder={$t('Password')}
		label={$t('Password')}
		bind:value={password}
		isInvalid={!createUserFormSchema.safeParse({ password }).success}
		error={$t('weak_password')}
	/>
	{#if $form?.invalid_password}
		<span class="text-[11px] font-medium leading-4 tracking-wide text-left text-error px-5"
			>{$t('invalid password')}
		</span>
	{/if}

	<PasswordField
		name="confirmpassword"
		placeholder={$t('Confirm password')}
		label={$t('Confirm password')}
		bind:value={confirmPassword}
		isInvalid={!fullCreateUserFormSchema.safeParse({ password, confirmPassword }).success}
		error={$t('password_mismatch')}
	/>
	<div class="max-w-full">
		<PhoneField
			bind:value={phone}
			isInValid={invalidPhone}
			onBlur={checkPhone}
			onInput={invalidatePhoneCheck}
			loading={loadingPhone}
			checked={phoneChecked}
		>
			<VerifyPhoneModal bind:phone />
		</PhoneField>
		{#if $form?.invalid_phone || invalidPhoneFormat}
			<div class="text-xs font-medium leading-4 pt-1 tracking-wide text-left text-error px-5"
				>{$t('invalid phone number')}
			</div>
		{:else if phoneTaken}
			<div class="relative w-full">
				<UsedPhone checked={phoneChecked} />
			</div>
		{/if}
	</div>
	<div class="flex flex-col items-center justify-center">
		<SubmitButton {disabled} ariaLabel={$t('Sign up')}>{$t('Sign up')}</SubmitButton>
	</div>
	<div class="flex items-start space-x-2 xl:-mx-3">
		<input
			type="checkbox"
			bind:checked={accepted}
			class="mt-1 form-checkbox h-6 w-6 focus:ring-0 rounded"
			name="accept"
			aria-label={$t('accept terms and conditions')}
		/>
		<span class="text-[17px] font-medium leading-6 tracking-[-0.15px] text-left"
			>{@html $t('uela')}</span
		>
	</div>
</form>
