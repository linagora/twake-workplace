<script lang="ts">
	import { nextPasswordRecoveryStep } from '$src/store';
	import { t } from 'svelte-i18n';
	import PrimaryButton from '$components/button/PrimaryButton.svelte';
	import Confirmed from '$components/icons/Confirmed.svelte';
</script>

<div class="flex flex-col px-4 lg:px-0 h-full pb-[28px] lg:pb-6">
	<div class="w-[386px] h-[238px]" />
	<div class="flex p-[16px] flex-col items-center gap-[4px] self-stretch">
		<Confirmed />
		<h1 class="text-center text-[22px] not-italic font-semibold leading-7">
			{$t('password-updated')}
		</h1>
	</div>
	<div class="mt-auto py-4">
		<PrimaryButton ariaLabel="next" handler={nextPasswordRecoveryStep}
			>{$t('go-sign-in')}</PrimaryButton
		>
	</div>
</div>
