<script lang="ts">
	import { enhance } from '$app/forms';
	import { t } from 'svelte-i18n';
	import { form } from '../../../store';
	import SubmitButton from '../button/SubmitButton.svelte';
	import PasswordField from '../input/PasswordField.svelte';
	import TextField from '../input/TextField.svelte';
	import OutlineLink from '../link/OutlineLink.svelte';

	let login = '';
	let password = '';

	$: failedLogin = $form?.failed_login === true;
	$: disabled = login.length === 0 || password.length === 0;
</script>

<form
	use:enhance
	action="?/login"
	method="POST"
	class="flex flex-col space-y-4 px-4 py-3 xl:px-3 lg:space-y-5 font-[Inter] w-full h-full"
>
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
	<div class="flex flex-col items-center space-y-5 flex-1 justify-end h-full">
		<SubmitButton ariaLabel={$t('Sign in')} {disabled}>{$t('Sign in')}</SubmitButton>
		<OutlineLink href="/login">{$t('Login with SSO')}</OutlineLink>
		<a href="#/recover" class="text-primary text-sm font-medium leading-5 tracking-wide"
			>{$t('recover password')}</a
		>
	</div>
</form>
