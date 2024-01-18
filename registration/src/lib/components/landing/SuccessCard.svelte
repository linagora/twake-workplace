<script lang="ts">
	import OutlineButton from './../button/OutlineButton.svelte';
	import TdriveProduct from '../products/TdriveProduct.svelte';
	import TmailProduct from '../products/TmailProduct.svelte';
	import TwakeProduct from '../products/TwakeProduct.svelte';
	import MobileSuccessInfo from '../user/MobileSuccessInfo.svelte';
	import SuccessInfo from '../user/SuccessInfo.svelte';

	export let user: string;
	export let id: string;
	export let phone: string;
</script>

<div
	class="lg:space-y-5 py-10 lg:py-4 xl:py-5 bg-[#FFFBFE] md:shadow-xl lg:rounded-3xl flex flex-col space-y-5 w-full xl:w-1/2 px-5 xl:px-10 h-full"
>
	<div
		class="flex flex-col space-y-4 w-full items-center justify-center text-sm font-medium leading-5 tracking-wide text-center"
	>
		<div class="lg:hidden w-full">
			<MobileSuccessInfo {user} {id} {phone} />
		</div>
		<div class="hidden lg:block w-full">
			<SuccessInfo {user} />
		</div>

		<div class="flex flex-col space-y-4 w-full">
			<TwakeProduct />
			<TdriveProduct />
			<TmailProduct />
		</div>
	</div>
</div>
