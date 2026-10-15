<script lang="ts">
	import type { Snippet } from 'svelte';

	let { class: className = '', children }: { class?: string; children: Snippet } = $props();
</script>

<section class={`overflow-hidden rounded-2xl bg-surface-container-low ${className}`}>
	{@render children()}
</section>
