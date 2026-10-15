<script lang="ts">
	import { courseColorName } from '#lib/course-colors.svelte.ts';

	let {
		id,
		size = 'sm',
		class: className = ''
	}: { id: string; size?: 'sm' | 'md' | 'lg'; class?: string } = $props();

	const SIZE = { sm: 'size-2', md: 'size-2.5', lg: 'size-3' } as const;
</script>

<span
	data-course-color={courseColorName(id)}
	class={`${SIZE[size]} rounded-full bg-course ${className}`}
></span>
