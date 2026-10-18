<script lang="ts">
	import type { Snippet } from 'svelte';

	let { class: className = '', children }: { class?: string; children: Snippet } = $props();
</script>

<section class={`w-full overflow-hidden rounded-md bg-surface-container-low ${className}`}>
	{@render children()}
</section>
