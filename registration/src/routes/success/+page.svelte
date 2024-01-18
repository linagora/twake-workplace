<script lang="ts">
	import {
		challenge as challengeStore,
		redirectUrl as redirectUrlStore,
		clientId as clientIdStore
	} from './../../store';
	import type { PageData } from './$types';
	import SuccessCard from '$lib/components/landing/SuccessCard.svelte';
	import LoggedUser from '$lib/components/nav/LoggedUser.svelte';
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
	<div class="flex flex-col lg:space-y-5">
		<div class="h-20 flex-row w-full lg:p-10 hidden lg:flex">
			<div class="w-full" />
			<div class="right-0 w-52">
				<LoggedUser {username} {user} />
			</div>
		</div>
		<div class="flex space-x-4 w-full lg:px-48 lg:py-4">
			<div class="w-full overflow-hidden">
				<div
					class="flex flex-col-reverse lg:flex-row-reverse w-full lg:space-x-20 lg:py-10 lg:px-10 h-full"
				>
					<SuccessCard {user} bind:id={username} {phone} />
					<div class="hidden lg:block w-full">
						<LoggedHero />
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
