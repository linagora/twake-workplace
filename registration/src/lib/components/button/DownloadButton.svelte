<script lang="ts">
	import { goto } from '$app/navigation';
	import { t } from 'svelte-i18n';

	export let url: string;

	const handler = () => {
		goto(url);
	};
</script>

<button
	class="inline-flex h-[36px] p-[6px] justify-center items-center gap-[8px] flex-shrink-0 rounded-[10px]"
	aria-label="Download app"
  type="button"
	on:click={handler}
>
	<span class="text-primary text-[17px] font-medium tracking-[0px]">
		{$t('Download')}
	</span>
</button>
