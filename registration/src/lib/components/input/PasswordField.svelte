<script lang="ts">
	import type { PasswordType } from '../../../types';
	import FieldError from '../dispaly/FieldError.svelte';
	import ErrorIcon from '../icons/ErrorIcon.svelte';
	import Hide from '../icons/hide.svelte';
	import Show from '../icons/show.svelte';
	import Valid from '../icons/valid.svelte';
	import { t } from 'svelte-i18n'

	export let value: string;
	export let isInvalid: boolean;
	export let label: string;
	export let name: string;
	export let placeholder: string;
	export let feedback: boolean = true;
	export let info: boolean = true;
	export let error: string = '';

	let type: PasswordType = 'password';

	const handleChange = (e: Event) => {
		value = (e.target as HTMLInputElement).value;
	};

	const toggleVisibility = () => {
		type = type === 'text' ? 'password' : 'text';
	};

	$: notValid = value.length > 0 && isInvalid;
</script>

<div class="flex flex-col space-y-1">
	<div class="relative">
		<input
			id={name}
			{placeholder}
			{value}
			{type}
			{name}
			on:input={handleChange}
			class="h-[52px] rounded-[4px] ring-1 focus:outline-none px-5 text-[17px] font-medium leading-6 tracking-tight text-left peer w-full placeholder:text-transparent {notValid
				? 'ring-error focus:ring-error'
				: 'ring-inputOutline focus:ring-primary'}"
			required
		/>
		<label
			for={name}
			class="absolute left-0 peer-focus:text-primary bg-white px-1 duration-100 ease-linear ml-1 -translate-y-2.5 translate-x-2 overflow-hidden text-ellipsis text-[11px] not-italic font-medium leading-4 tracking-[0.5px] {notValid
				? 'text-error peer-focus:text-error'
				: 'text-disabled-text peer-focus:text-primary'}">{label}</label
		>
		<span class="absolute inset-y-0 right-0 flex items-center px-2">
			{#if value}
				<button
					aria-label={$t("hide or show")}
					type="button"
					class="focus:outline-none focus:shadow-outline"
					on:click={toggleVisibility}
				>
					{#if type === 'text'}
						<Hide />
					{:else}
						<Show />
					{/if}
				</button>
				{#if notValid === false && feedback}
					<Valid />
				{:else if notValid && feedback && info}
					<ErrorIcon />
				{/if}
			{/if}
		</span>
	</div>
	{#if error.length && notValid}
		<FieldError {error} />
	{/if}
</div>
