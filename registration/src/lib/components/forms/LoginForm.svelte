<script lang="ts">
	import { enhance } from '$app/forms';
	import { t } from 'svelte-i18n';
	import { form } from '$store';
	import SubmitButton from '$components/button/SubmitButton.svelte';
	import PasswordField from '$components/input/PasswordField.svelte';
	import TextField from '$components/input/TextField.svelte';

	let login = '';
	let password = '';

	$: failedLogin = $form?.failed_login === true;
	$: disabled = login.length === 0 || password.length === 0;
</script>

<form
	use:enhance
	action="?/login"
	method="POST"
	class="flex flex-col space-y-4 px-4 py-3 xl:px-3 lg:space-y-5 w-full h-full lg:px-0 pb-[28px] lg:pb-6"
>
	<div class="flex flex-col items-start gap-6 self-stretch w-full">
		<TextField
			name="login"
			label={$t('Cellphone / Username / Email')}
			bind:value={login}
			placeholder={$t('login')}
			bind:isInValid={failedLogin}
			feedback={false}
		/>
		<PasswordField
			label={$t('Password')}
			name="password"
			bind:value={password}
			isInvalid={failedLogin}
			placeholder={$t('Password')}
			feedback={false}
			error={$t('Invalid credentials')}
		/>
		<div class="flex justify-center items-center rounded-[100px] w-full">
			<div class="flex p-[14px] justify-center items-center">
				<a
					href="/recover-password"
					title={$t('forgot-password')}
					class="text-center text-[14px] font-medium tracking-[0px] not-italic leading-[20px] text-primary"
				>
					{$t('forgot-password')}
				</a>
			</div>
		</div>
	</div>
	<div class="flex flex-col items-center space-y-5 flex-1 justify-end h-full py-4">
		<SubmitButton ariaLabel={$t('Sign in')} {disabled}>{$t('Sign in')}</SubmitButton>
	</div>
</form>
