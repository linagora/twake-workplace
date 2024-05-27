<script lang="ts">
	import {
		activeTab,
		app,
		form as formStore,
		userCountry,
		registrationStep,
		verified,
		phone,
		showBanner
	} from '$store';
	import AccessSelect from '$components/landing/AccessSelect.svelte';
	import Hero from '$components/landing/Hero.svelte';
	import type { ActionData, PageData } from './$types';
	import type { CountryCode } from 'svelte-tel-input/types';
	import type { ApplicationType } from '$types';

	export let form: ActionData;
	export let data: PageData;

	$: formStore.set(form);
	$: activeTab.set(data.isLogin ? 'login' : 'register');
	$: userCountry.set(data.country as CountryCode);
	$: app.set(data.app as ApplicationType);
	$: registrationStep.set(data.step);
	$: verified.set(data.verified);
	$: phone.set(data.phone ?? '');
	$: showBanner.set(data.banner);
</script>

<div class="flex w-full h-full lg:px-10 xl:px-[148px] 2xl:px-52 3xl:px-72 4xl:px-96">
	<div class="flex flex-col lg:flex-row w-full xl:space-x-24 h-full">
		<Hero />
		<AccessSelect />
	</div>
</div>
