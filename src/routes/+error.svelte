<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '#lib/components/ui/button/index.js';
</script>

<div class="mx-auto flex min-h-svh w-full max-w-lg flex-col justify-center px-4 py-10">
	<div class="rounded-3xl bg-surface p-8 sm:p-10">
		<p
			class="flex size-20 items-center justify-center rounded-[40%] bg-error-container text-title-lg text-on-error-container tabular-nums"
		>
			{page.status}
		</p>
		<h1 class="mt-6 text-headline-lg text-on-surface">Something went wrong</h1>
		<p class="mt-2 text-body-lg break-words text-on-surface-variant">{page.error?.message}</p>
		<div class="mt-8 flex gap-2">
			<Button href="/">Go home</Button>
			<Button variant="outline" onclick={() => location.reload()}>Reload</Button>
		</div>
	</div>
</div>
