<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		inset,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		inset?: boolean;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="context-menu-label"
	data-inset={inset}
	class={cn(
		'flex min-h-8 items-center px-3 text-label-lg text-on-surface-variant data-inset:ps-10',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
