<script lang="ts">
	import Logout from './../icons/Logout.svelte';
	import Avatar from './../icons/Avatar.svelte';
	import { t } from 'svelte-i18n';

	export let user: string;
	export let username: string;

	let open = false;

	const toggle = () => {
		open = !open;
	};
</script>

<div class="flex flex-col gap-2">
	<button
		aria-label="user menu"
		type="button"
		class="flex flex-row space-x-2 items-center justify-center"
		on:click={toggle}
	>
		<Avatar />
		<div class="flex flex-col gap-0">
			<h1 class=" text-[15px] font-semibold leading-5 tracking-normal text-left text-black">
				{user}
			</h1>
			<span class="text-[13px] font-normal leading-4 tracking-normal text-left text-gray-500"
				>@{username}</span
			>
		</div>
	</button>
	<div class="z-20 mt-2 overflow-hidden bg-white rounded-md shadow-xl {open ? 'block' : 'hidden'}">
		<a
			href="/logout"
			class="flex items-center p-3 -mt-2 text-sm transition-colors duration-200 transform hover:bg-gray-100"
		>
			<Logout />

			<div class="mx-1">
				<h1 class="text-sm font-semibold">{$t('Logout')}</h1>
			</div>
		</a>
	</div>
</div>
