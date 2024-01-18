<script lang="ts">
	export let href: string;
</script>

<a
	{href}
	class="flex items-center rounded-full justify-center w-full h-12 border border-blue-500 text-base font-medium leading-5 tracking-[0.1px] text-center text-blue-500"
>
	<slot />
</a>
