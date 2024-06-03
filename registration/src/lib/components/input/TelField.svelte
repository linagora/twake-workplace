<script lang="ts">
	import { PhoneInput } from 'react-international-phone';
	import 'react-international-phone/style.css';
	import { t } from 'svelte-i18n';
	import Spin from '$components/icons/SpinnerIcon.svelte';
	import { isPhoneValid } from '$utils/phone';
	import { defaultCountries } from '$utils/country';
	import { tick } from 'svelte';

	export let value: string | null = '';
	export let selectedCountry: string | null;
	export let valid: boolean;
	export let loading: boolean = false;
	export let onInput: () => void = () => {};

	const onChange = (val: string) => {
		value = val;
	};

	$: if (value && value.length > 3) {
		valid = isPhoneValid(value);
		onInput();
	}
</script>

<div
	class="flex relative px-4 py-1 ring-1 rounded-[4px] {valid
		? `ring-inputOutline focus-within:ring-primary`
		: ` ring-error focus-within:ring-offset-1 focus-within:ring-offset-error/50 focus-within:ring-1`} min-h-11"
>
	{#await tick()}
		<span class="absolute inset-y-0 left-0 flex items-center px-4">
			<Spin />
		</span>
	{:then}
		<react:PhoneInput
			className="border-none"
			on:input={onInput}
			on:change={onChange}
			defaultCountry={selectedCountry}
			countries={defaultCountries}
			inputClassName="!rounded-[4px] !focus:outline-none !text-[17px] !font-medium !leading-6 !tracking-tight !text-left !peer !w-full !placeholder:text-inputOutline !border-none"
		/>
	{/await}

	{#if loading}
		<span class="absolute inset-y-0 right-0 flex items-center px-1">
			<Spin />
		</span>
	{/if}
	<label
		for="phone"
		class="absolute left-0 bg-white px-1 duration-100 ease-linear ml-1 -translate-y-3.5 translate-x-2 overflow-hidden text-ellipsis text-[12px] not-italic font-medium leading-4 tracking-[0.5px] {!valid
			? 'text-error peer-focus:text-error'
			: 'text-disabled-text peer-focus:text-primary'}">{$t('Phone number')}</label
	>
</div>

<style>
	:global(.react-international-phone-country-selector-button) {
		border: none !important;
	}
</style>
