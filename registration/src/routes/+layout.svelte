<script>
	import '$src/app.css';
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
	class="w-full h-[100dvh] max-h-[max(100dvh,768px)] min-h-[min(100dvh,768px)] overflow-x-hidden overflow-y-scroll bg-white md:gradiant flex flex-col font-[Inter]"
>
	<slot />
</div>
