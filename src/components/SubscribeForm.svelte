<script lang="ts">
	let email = '';
	let isSubmitting = false;

	function handleSubmit() {
		if (!email) return;

		const encodedEmail = encodeURIComponent(email);
		const magicLink = `https://magic.beehiiv.com/v1/3277ec57-aca9-4d2e-89dd-eda570b4736c?email=${encodedEmail}`;
		window.location.href = magicLink;
	}
</script>

<section
	class="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800"
>
	<h2 class="mb-4 text-center text-3xl font-light tracking-tight text-gray-800 dark:text-white">
		Subscribe to My Newsletter
	</h2>
	<p
		class="mx-auto max-w-2xl text-center text-base leading-relaxed text-gray-600 dark:text-gray-300"
	>
		Sign up to receive mostly-weekly productivity tips and tools, AI news, and the random thoughts
		of a self-employed web developer with ADHD.
	</p>
	<form
		on:submit|preventDefault={handleSubmit}
		class="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
	>
		<div class="w-full max-w-sm">
			<label for="email" class="sr-only">Email address</label>
			<input
				type="email"
				id="email"
				name="email"
				bind:value={email}
				placeholder="Enter your email"
				required
				class="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
			/>
		</div>
		<button
			type="submit"
			disabled={!email || isSubmitting}
			class="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400"
		>
			Subscribe
		</button>
	</form>
</section>
