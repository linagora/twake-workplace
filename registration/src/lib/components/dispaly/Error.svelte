<script>
	import { t } from 'svelte-i18n';
</script>

<div
	class="font-regular relative block w-full max-w-screen-md rounded-lg bg-error px-4 py-4 text-base text-white"
	data-dismissible="alert"
>
	<div class="absolute top-4 left-4">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
			class="h-6 w-6"
		>
			<path
				fill-rule="evenodd"
				d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
				clip-rule="evenodd"
			/>
		</svg>
	</div>
	<div class="ml-8 mr-12">
		<h5
			class="block font-sans text-xl font-semibold leading-snug tracking-normal text-white antialiased"
		>
			{$t('Error')}
		</h5>
		<p class="mt-2 block font-sans text-base font-normal leading-relaxed text-white antialiased">
			{ $t('sorry-something-went-wrong-please-try-again') }
		</p>
	</div>
	<div
		data-dismissible-target="alert"
		data-ripple-dark="true"
		class="absolute top-3 right-3 w-max rounded-lg transition-all hover:bg-white hover:bg-opacity-20"
	>
		<div role="button" class="w-max rounded-lg p-1">
			<a href="/">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</a>
		</div>
	</div>
</div>
