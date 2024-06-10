<script lang="ts">
	import { enhance } from '$app/forms';
	import PrimaryButton from '$components/buttons/PrimaryButton.svelte';
	import PasswordField from '$components/input/PasswordField.svelte';
	import { createUserFormSchema, fullCreateUserFormSchema } from '$lib/schemas/zodSchema';
	import { resetUserInfo } from '$store';
	import { t } from 'svelte-i18n';

	let sendPasswordForm: HTMLFormElement;

	let password = '';
	let confirmPassword = '';
	let loading = false;

	$: disabled =
		!fullCreateUserFormSchema.safeParse({
			password,
			confirmPassword
		}).success || loading;

	const handler = () => {
		if (disabled) return;

		sendPasswordForm.requestSubmit();
	};
</script>

<form
	action="?/register"
	method="POST"
	class="hidden"
	bind:this={sendPasswordForm}
	use:enhance={() => {
		loading = true;

		return async ({ update }) => {
			loading = false;

			update();
			resetUserInfo();
		};
	}}
>
	<input type="text" name="password" bind:value={password} required />
</form>

<div class="flex flex-col px-4 lg:px-0 h-full pt-20 pb-[28px] lg:pb-6">
	<div class="flex p-4 flex-col items-center gap-[4px] self-stretch">
		<div class="self-stretch text-center text-zinc-900 text-[22px] font-semibold leading-7">
			{$t('Set-your-password')}
		</div>
		<div class="text-center text-gray-400 text-base font-normal leading-normal">
			{$t('set-a-strong-password-with-letters-numbers-and-symbols')}
		</div>
	</div>
	<div class="flex py-4 flex-col gap-6 self-stretch">
		<PasswordField
			name="password"
			placeholder={$t('Password')}
			label={$t('Password')}
			bind:value={password}
			isInvalid={!createUserFormSchema.safeParse({ password }).success}
			error={$t('weak_password')}
		/>

		<PasswordField
			name="confirmpassword"
			placeholder={$t('Confirm password')}
			label={$t('Confirm password')}
			bind:value={confirmPassword}
			isInvalid={!fullCreateUserFormSchema.safeParse({ password, confirmPassword }).success}
			error={$t('password_mismatch')}
		/>
	</div>
	<div class="flex flex-col mt-auto gap-4 space-y-4 py-4">
		<PrimaryButton ariaLabel="next" {disabled} {handler} {loading}>{$t('Sign up')}</PrimaryButton>
	</div>
</div>
