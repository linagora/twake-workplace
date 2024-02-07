<script lang="ts">
	import TelField from '$lib/components/input/TelField.svelte';
	import { t } from 'svelte-i18n';
	import { userCountry } from '$lib/../store';
	import PrimaryButton from '$lib/components/button/PrimaryButton.svelte';
	import { createUserFormSchema } from '$lib/schemas/zodSchema';
	import { isPhoneTaken } from '$lib/utils/api';
	import type { E164Number } from 'svelte-tel-input/types';

	export let value: null | E164Number = null;
	export let valid = true;
	export let handler: () => void = () => {};

	let loading = false;
	let phoneChecked = false;
	let phoneTaken = false;

	$: disabled = !valid || phoneTaken || loading;

  $: console.log(value)

	const checkPhone = async () => {
		if (!value || !createUserFormSchema.safeParse({ value }).success || phoneChecked) return;

		loading = true;
		phoneChecked = true;
		phoneTaken = await isPhoneTaken(value);

		loading = false;
	};

	const invalidatePhoneCheck = () => {
		phoneChecked = false;
		phoneTaken = false;
	};
</script>

<div class="flex flex-col px-4 lg:px-0 lg:h-fit h-screen">
	<div class="w-[386px] h-20" />
	<div class="h-28 py-4 flex-col justify-start items-center gap-1 flex">
		<div class="self-stretch text-center text-zinc-900 text-[22px] font-semibold leading-7">
			{$t('Your-phone-number')}
		</div>
		<div
			class="self-stretch text-center text-gray-400 text-base font-normal leading-normal tracking-[0px] px-10"
		>
			{$t('please-confirm')}
		</div>
	</div>
	<div class="py-4">
		<TelField
			bind:valid
			bind:value
			bind:selectedCountry={$userCountry}
			{loading}
			onInput={invalidatePhoneCheck}
			onBlur={checkPhone}
		/>
	</div>
	<div class="w-[386px] h-[236px]" />
	<div class="mt-auto py-4">
		<PrimaryButton ariaLabel="next" {disabled} {handler}>{$t('Next')}</PrimaryButton>
	</div>
</div>
