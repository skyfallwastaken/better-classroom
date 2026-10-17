<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();
</script>

<span
	bind:this={ref}
	data-slot="dropdown-menu-shortcut"
	class={cn(
		'ml-auto pl-3 text-label-sm text-on-surface-variant group-data-[variant=destructive]/dropdown-menu-item:text-error',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</span>
