<script lang="ts">
	import PasswordRecovery from '$components/views/PasswordRecovery.svelte';
	import Hero from '$components/landing/Hero.svelte';
	import type { PageData, ActionData } from './$types';
	import {
		recoveryForm,
		passwordRecoveryStep,
		userCountry,
		recoveryPhone,
		verifiedRecovery
	} from '$store';
	import type { CountryCode } from 'svelte-tel-input/types';

	export let data: PageData;
	export let form: ActionData;

	$: ({ phone, verified, step, country } = data);
	$: recoveryForm.set(form);
	$: passwordRecoveryStep.set(step);
	$: recoveryPhone.set(phone);
	$: verifiedRecovery.set(verified);
	$: userCountry.set(country as CountryCode);
</script>

<div class="flex w-full h-full lg:px-10 xl:px-[148px] 2xl:px-52 3xl:px-72 4xl:px-96">
	<div class="flex flex-col lg:flex-row w-full xl:space-x-24 h-full">
		<Hero />
		<PasswordRecovery />
	</div>
</div>
