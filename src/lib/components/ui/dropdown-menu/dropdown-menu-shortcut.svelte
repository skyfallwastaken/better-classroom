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
		'ml-auto text-body-sm tracking-widest text-on-surface-variant group-focus/dropdown-menu-item:text-on-secondary-container group-data-[variant=destructive]/dropdown-menu-item:text-destructive group-focus/dropdown-menu-item:group-data-[variant=destructive]/dropdown-menu-item:text-destructive',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</span>
