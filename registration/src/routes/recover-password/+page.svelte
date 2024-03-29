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

	export let data: PageData;
	export let form: ActionData;

	$: ({ phone, verified } = data);
	$: recoveryForm.set(form);
</script>

<div class="flex w-full h-full lg:px-10 xl:px-[124px] 2xl:px-52 3xl:px-72 4xl:px-96">
	<div class="flex flex-col lg:flex-row w-full lg:pt-9 xl:space-x-24 h-full">
		<Hero />
		<PasswordRecovery />
	</div>
</div>
