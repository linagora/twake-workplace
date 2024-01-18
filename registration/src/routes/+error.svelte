<script>
	import Error from '$lib/components/dispaly/Error.svelte';

	import { page } from '$app/stores';
	import { dev } from '$app/environment';
	import Fail from '$lib/components/dispaly/Fail.svelte';
</script>

<div
	class="flex space-x-4 w-full min-w-screen min-h-screen bg-gray-900 items-center justify-center px-5 py-5"
>
	<div
		class="bg-gray-800 text-gray-500 rounded-xl flex flex-col shadow-xl px-2 py-16 md:px-16 w-full md:w-2/3 lg:w-2/5 space-y-5"
	>
		<Error />

		{#if dev}
			<Fail>
				{$page.status} - {$page.error?.message}
			</Fail>
		{/if}
	</div>
</div>
