<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLOlAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLOlAttributes> = $props();
</script>

<ol
	bind:this={ref}
	data-slot="breadcrumb-list"
	class={cn(
		// m3e breadcrumb: label-large items separated by 24px on-surface-variant chevrons.
		'flex flex-wrap items-center gap-0 text-label-lg wrap-break-word text-on-surface-variant',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</ol>
