<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLTableRowElement>> = $props();
</script>

<tr
	bind:this={ref}
	data-slot="table-row"
	class={cn(
		'border-b border-outline-variant transition-colors duration-200 ease-standard hover:bg-on-surface/8 data-[state=selected]:bg-secondary-container data-[state=selected]:text-on-secondary-container',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</tr>
