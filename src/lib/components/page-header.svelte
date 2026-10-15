<script lang="ts">
	import type { Snippet } from 'svelte';
	let {
		title,
		description,
		children,
		actions
	}: { title: string; description?: string; children?: Snippet; actions?: Snippet } = $props();
</script>

<div class="flex flex-wrap items-start justify-between gap-4">
	<div class="min-w-0">
		<h1 class="text-headline-lg text-balance text-on-surface sm:text-display-sm">{title}</h1>
		{#if description}<p class="mt-2 text-body-lg text-pretty text-on-surface-variant">
				{description}
			</p>{/if}
		{#if children}<div class="mt-2">{@render children()}</div>{/if}
	</div>
	{#if actions}<div class="flex min-w-0 flex-wrap items-center gap-2">{@render actions()}</div>{/if}
</div>
