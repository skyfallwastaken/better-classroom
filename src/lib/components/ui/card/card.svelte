<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		size = 'default',
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & { size?: 'default' | 'sm' } = $props();
</script>

<div
	bind:this={ref}
	data-slot="card"
	data-size={size}
	class={cn(
		// M3 filled card (Compose FilledCardTokens, m3e card): CornerMedium (12px), 16px padding,
		// surface-container-highest container, body-medium on-surface content.
		'group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-md bg-surface-container-highest py-(--card-spacing) text-body-md text-on-surface [--card-spacing:--spacing(4)] has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] *:[img:first-child]:rounded-t-md *:[img:last-child]:rounded-b-md',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
