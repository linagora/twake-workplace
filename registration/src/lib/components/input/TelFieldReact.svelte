<script lang="ts">
	import { PhoneInput } from 'react-international-phone';
	import 'react-international-phone/style.css';
	import { t } from 'svelte-i18n';
	import Spin from '$components/icons/SpinnerIcon.svelte';

	export let value: string | null;
	export let selectedCountry: string | null;
	export let valid: boolean;
	export let loading: boolean = false;
	export let onBlur: () => void = () => {};
	export let onInput: () => void = () => {};

	const onChange = (e: any) => {
		console.log(e);
	};
</script>

<div
	class="flex relative ring-1 rounded-[4px] {valid
		? `ring-inputOutline focus-within:ring-primary`
		: ` ring-error focus-within:ring-offset-1 focus-within:ring-offset-error/50 focus-within:ring-1`}"
>
	<react:PhoneInput
    onBlur={onBlur}
    className="border-none"
		inputClassName="h-[54px] rounded-[4px] focus:outline-none text-[17px] font-medium leading-6 tracking-tight text-left peer w-full placeholder:text-inputOutline !border-none"
	/>
	{#if loading}
		<span class="absolute inset-y-0 right-0 flex items-center px-1">
			<Spin />
		</span>
	{/if}
	<label
		for="phone"
		class="absolute left-0 bg-white px-1 duration-100 ease-linear ml-1 -translate-y-2.5 translate-x-2 overflow-hidden text-ellipsis text-[11px] not-italic font-medium leading-4 tracking-[0.5px] {!valid
			? 'text-error peer-focus:text-error'
			: 'text-disabled-text peer-focus:text-primary'}">{$t('Phone number')}</label
	>
</div>
