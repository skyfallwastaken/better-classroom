<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="sidebar-menu-badge"
	data-sidebar="menu-badge"
	class={cn(
		'pointer-events-none absolute right-4 flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-label-lg font-medium text-on-surface-variant tabular-nums select-none group-data-[collapsible=icon]:hidden peer-data-[size=default]/menu-button:top-3 peer-data-[size=lg]/menu-button:top-4 peer-data-[size=sm]/menu-button:top-1.5 peer-data-active/menu-button:text-on-secondary-container',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
