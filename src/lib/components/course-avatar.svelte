<script lang="ts">
	import type { Snippet } from 'svelte';
	import { courseColorName } from '#lib/course-colors.svelte.ts';

	/** A tonal circle in the course's colour holding either its initial or an icon, as Classroom does. */
	let {
		id,
		name = '',
		class: className = '',
		children
	}: { id: string; name?: string; class?: string; children?: Snippet } = $props();
</script>

<span
	data-course-color={courseColorName(id)}
	aria-hidden="true"
	class={`flex size-10 shrink-0 items-center justify-center rounded-full bg-course-container text-title-md font-medium text-on-course-container [&_svg]:size-6 ${className}`}
>
	{#if children}{@render children()}{:else}{name.trim().charAt(0).toUpperCase()}{/if}
</span>
