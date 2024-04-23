<script lang="ts">
	import {
		challenge as challengeStore,
		redirectUrl as redirectUrlStore,
		clientId as clientIdStore
	} from '$store';
	import type { PageData } from './$types';
	import SuccessCard from '$lib/components/landing/SuccessCard.svelte';
	import LoggedUser from '$components/user/LoggedUser.svelte';
	import LoggedHero from '$lib/components/landing/LoggedHero.svelte';

	export let data: PageData;

	$: user = `${data.firstName} ${data.lastName}`;
	$: username = data.username ?? '';
	$: phone = data.phone ?? '';
	$: redirectUrlStore.set(data.redirectUrl);
	$: challengeStore.set(data.challenge);
	$: clientIdStore.set(data.clientId);
</script>

<div class="w-full h-full lg:h-fit">
	<div class="flex flex-col h-full lg:space-y-5">
		<div class="h-20 flex-row w-full lg:p-10 hidden lg:flex">
			<div class="w-full" />
			<div class="right-0 w-56">
				<LoggedUser {username} {user} />
			</div>
		</div>
		<div class="flex w-full hvh lg:px-10 xl:px-[124px] 2xl:px-52 3xl:px-72 4xl:px-96 lg:py-4">
			<div class="w-full h-full">
				<div class="flex flex-col-reverse lg:flex-row-reverse w-full lg:pt-9 xl:space-x-24 h-full">
					<SuccessCard {user} bind:id={username} {phone} />
					<div class="hidden lg:block w-full">
						<LoggedHero />
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
