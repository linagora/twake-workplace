<script lang="ts">
	import { activeTab, form as formStore } from './../store';
	import AccessSelect from '$lib/components/landing/AccessSelect.svelte';
	import Hero from '$lib/components/landing/Hero.svelte';
	import type { ActionData, PageData } from './$types';

	export let form: ActionData;
	export let data: PageData;
	$: formStore.set(form);
	$: activeTab.set(data.isLogin ? 'login' : 'register');
</script>

<div class="flex w-full h-full lg:px-10 xl:px-[124px]">
	<div class="flex flex-col lg:flex-row w-full pt-9 xl:space-x-24">
		<Hero />
		<AccessSelect />
	</div>
</div>
