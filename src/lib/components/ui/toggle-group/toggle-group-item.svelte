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
		toggleVariants({
			variant: ctx.variant || variant,
			size: ctx.size || size
		}),
		/*
		 * M3 Expressive connected button group (Compose ButtonGroupDefaults.connected*ButtonShapes):
		 * outer ends stay round, inner corners are 8dp, tighten to 4dp while pressed, and the
		 * selected segment becomes a capsule. Radii are finite (28px clamps to half the height)
		 * so the morph animates instead of jumping from 8px to `infinity`.
		 */
		'shrink-0 [--outer:28px] [--r:8px] focus:z-10 focus-visible:z-10 active:[--r:4px] data-[state=on]:not-active:[--r:28px]',
		'group-data-[spacing=0]/toggle-group:rounded-(--r)',
		'group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-(--outer) group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-(--outer)',
		'group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-(--outer) group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-(--outer)',
		className
	)}
	{value}
	{...restProps}
/>
