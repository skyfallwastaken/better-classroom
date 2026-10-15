<script lang="ts">
	import { ToggleGroup as ToggleGroupPrimitive } from 'bits-ui';
	import { type ToggleVariants, toggleVariants } from '#lib/components/ui/toggle/index.js';
	import { cn } from '#lib/utils.js';
	import { getToggleGroupCtx } from './toggle-group.svelte';

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		size,
		variant,
		...restProps
	}: ToggleGroupPrimitive.ItemProps & ToggleVariants = $props();

	const ctx = getToggleGroupCtx();
</script>

<ToggleGroupPrimitive.Item
	bind:ref
	data-slot="toggle-group-item"
	data-variant={ctx.variant || variant}
	data-size={ctx.size || size}
	data-spacing={ctx.spacing}
	class={cn(
		// Connected button group: inner corners are small until the segment is selected, then it rounds fully.
		'shrink-0 group-data-[spacing=0]/toggle-group:rounded-sm focus:z-10 focus-visible:z-10 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-full group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-full group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-full group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-full group-data-[spacing=0]/toggle-group:data-[state=on]:rounded-full',
		toggleVariants({
			variant: ctx.variant || variant,
			size: ctx.size || size
		}),
		className
	)}
	{value}
	{...restProps}
/>
