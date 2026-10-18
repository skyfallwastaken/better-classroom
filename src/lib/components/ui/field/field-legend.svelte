<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		variant = 'legend',
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLLegendElement>> & {
		variant?: 'legend' | 'label';
	} = $props();
</script>

<legend
	bind:this={ref}
	data-slot="field-legend"
	data-variant={variant}
	class={cn(
		'mb-1.5 text-on-surface data-[variant=label]:text-label-lg data-[variant=legend]:text-title-md',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</legend>
