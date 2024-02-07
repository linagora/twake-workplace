<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { clickOutsideAction } from 'svelte-tel-input/utils';
	import { TelInput, isSelected, normalizedCountries } from 'svelte-tel-input';
	import type {
		DetailedValue,
		CountrySelectEvents,
		CountryCode,
		E164Number,
		TelInputOptions,
		Country
	} from 'svelte-tel-input/types';
	import 'svelte-tel-input/styles/flags.css';
	import { t } from 'svelte-i18n';
	import NavigateBack from '$lib/components/button/NavigateBack.svelte';
	import SearchIcon from '$lib/components/icons/SearchIcon.svelte';
	import Spin from '$lib/components/icons/Spin.svelte';

	export let clickOutside = true;
	export let closeOnClick = true;
	export let disabled = false;
	export let detailedValue: DetailedValue | null = null;
	export let value: E164Number | null;
	export let searchPlaceholder: string | null = $t('Search');
	export let selectedCountry: CountryCode | null;
	export let valid: boolean;
	export let options: TelInputOptions = { format: 'national' };
	export let loading: boolean = false;
	let searchText = '';
	let isOpen = false;

	let isSearching = false;

	$: selectedCountryDialCode =
		normalizedCountries.find((el) => el.iso2 === selectedCountry)?.dialCode || null;

	const toggleDropDown = (e?: Event) => {
		e?.preventDefault();
		if (disabled) return;
		isOpen = !isOpen;
	};

	const closeDropdown = (e?: Event) => {
		if (isOpen) {
			e?.preventDefault();
			isOpen = false;
			searchText = '';
		}
	};

	const selectClick = () => {
		if (closeOnClick) closeDropdown();
	};

	const closeOnClickOutside = () => {
		if (clickOutside) {
			closeDropdown();
		}
	};

	const sortCountries = (countries: Country[], text: string) => {
		const normalizedText = text.trim().toLowerCase();
		if (!normalizedText) {
			return countries.sort((a, b) => a.label.localeCompare(b.label));
		}

		return countries.filter(({ name }) => name.toLocaleLowerCase().includes(normalizedText));
	};

	const handleSelect = (val: CountryCode, e?: Event) => {
		if (disabled) return;
		e?.preventDefault();
		if (
			selectedCountry === undefined ||
			selectedCountry === null ||
			(typeof selectedCountry === typeof val && selectedCountry !== val)
		) {
			selectedCountry = val;
			onChange(val);
			selectClick();
		} else {
			dispatch('same', { option: val });
			selectClick();
		}
	};

	const dispatch = createEventDispatcher<CountrySelectEvents<CountryCode>>();

	const onChange = (selectedCountry: CountryCode) => {
		dispatch('change', { option: selectedCountry });
	};
</script>

<div
	class="flex relative ring-1 rounded-[4px] {valid
		? `ring-inputOutline focus-within:ring-primary`
		: ` ring-error focus-within:ring-offset-1 focus-within:ring-offset-error/50 focus-within:ring-1`}"
>
	<div class="flex mr-2" use:clickOutsideAction={closeOnClickOutside}>
		<button
			id="states-button"
			data-dropdown-toggle="dropdown-states"
			class="relative flex-shrink-0 overflow-hidden z-10 whitespace-nowrap inline-flex items-center py-2.5 px-4 text-sm font-medium text-center rounded-l-lg focus:outline-none"
			type="button"
			role="combobox"
			aria-controls="dropdown-countries"
			aria-expanded="false"
			aria-haspopup="false"
			on:click={toggleDropDown}
		>
			{#if selectedCountry && selectedCountry !== null}
				<div class="inline-flex items-center text-left">
					<span class="flag flag-{selectedCountry.toLowerCase()} flex-shrink-0 mr-3" />
					<svg
						aria-hidden="true"
						class="ml-1 w-4 h-4 {isOpen ? 'rotate-180' : ''}"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
					{#if options.format === 'national'}
						<span class=" border-l ml-1 pl-1 text-[17px] font-medium leading-6 tracking-tight"
							>+{selectedCountryDialCode}</span
						>
					{/if}
				</div>
			{:else}
				Please select
				<svg
					aria-hidden="true"
					class="ml-1 w-4 h-4 {isOpen ? 'rotate-180' : ''}"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill-rule="evenodd"
						d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			{/if}
		</button>
		{#if isOpen}
			<div
				id="dropdown-countries"
				class="fixed top-0 left-0 lg:absolute z-10 w-full h-full lg:h-fit bg-white divide-y divide-gray-100 shadow overflow-hidden lg:translate-y-11 rounded-[8px] bg-[var(--m-3-sys-light-bg-surface-surface,_#F4F4F4)] [box-shadow:0px]"
				data-popper-reference-hidden=""
				data-popper-escaped=""
				data-popper-placement="bottom"
				aria-orientation="vertical"
				aria-labelledby="country-button"
				tabindex="-1"
			>
				<div
					class="text-sm text-gray-700 max-h-screen lg:max-h-60 bg-white overflow-y-auto pt-12 lg:pt-0"
					aria-labelledby="countries-button"
					role="listbox"
				>
					<div class="flex flex-row fixed lg:sticky w-full top-0 bg-white shadow-sm">
						<NavigateBack handler={() => (isOpen = false)} />
						{#if isSearching}
							<input
								aria-autocomplete="list"
								type="text"
								class="text-left focus:outline-none text-[17px] w-full font-medium tracking-[0px] font-[Inter] not-italic leading-[24px] lg:px-10"
								bind:value={searchText}
								placeholder={searchPlaceholder}
							/>
						{:else}
							<button
								on:click={() => (isSearching = true)}
								type="button"
								class="px-5 py-2 text-gray-900 focus:outline-none w-full sticky top-0 text-center text-[22px] lg:text-sm lg:text-left lg:px-5 font-semibold"
							>
								{$t('Choose-a-country')}
							</button>
						{/if}
						<button type="button" on:click={() => (isSearching = !isSearching)}>
							<SearchIcon />
						</button>
					</div>

					{#each sortCountries(normalizedCountries, searchText) as country (country.id)}
						{@const isActive = isSelected(country.iso2, selectedCountry)}
						<div id="country-{country.iso2}" role="option" aria-selected={isActive}>
							<button
								value={country.iso2}
								type="button"
								class="inline-flex py-2 px-4 w-full text-sm hover:bg-gray-100
                             active:bg-white overflow-hidden
                            {isActive ? 'bg-gray-200 ' : ''}"
								on:click={(e) => {
									handleSelect(country.iso2, e);
								}}
							>
								<div class="inline-flex items-center space-x-2 text-left">
									<span class="flag flag-{country.iso2.toLowerCase()} flex-shrink-0 mr-3" />
									<span class="mr-2 text-center text-[17px] font-medium tracking-[0px]"
										>{country.name}</span
									>
									<span class="text-center text-[17px] font-medium tracking-[0px]"
										>(+{country.dialCode})</span
									>
								</div>
							</button>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>

	<TelInput
		bind:country={selectedCountry}
		bind:detailedValue
		bind:value
		bind:valid
		{options}
		required
		class="h-[54px] rounded-[4px] focus:outline-none text-[17px] font-medium leading-6 tracking-tight text-left peer w-full placeholder:text-inputOutline"
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
