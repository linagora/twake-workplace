<script>
	import '../app.css';

	let currentYear = new Date().getFullYear();
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="description" content="Twake on matrix registration" />
	<meta name="keywords" content="Sveltekit, Matrix, Linagora, Twake" />
	<meta name="author" content="Linagora" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link href="https://fonts.googleapis.com/css?family=Inter" rel="stylesheet" />
	<title>Sign up on Twake</title>
</svelte:head>

<div
	class="w-full lg:h-[100vh] overflow-x-hidden overflow-y-scroll gradiant flex flex-col font-[Inter]"
>
	<slot />
	<span
		class="hidden overflow-hidden lg:block absolute bottom-[35px] left-72 text-sm not-italic font-medium leading-5 tracking-[0.1px] text-blueGray"
		>© 2000-{currentYear}, LINAGORA</span
	>
</div>

<style>
	.gradiant {
		background: linear-gradient(
				106deg,
				rgba(248, 169, 52, 0.2) 0%,
				rgba(203, 40, 206, 0.2) 43.6%,
				rgba(10, 132, 255, 0.2) 100%
			),
			#fff;
	}
</style>
