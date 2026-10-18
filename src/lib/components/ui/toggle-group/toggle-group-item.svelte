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
		 * selected segment becomes a capsule. The outer radius is exactly half the height: a
		 * finite value lets the morph animate, and a larger one would make the browser scale
		 * down every corner on the end segments, inner ones included.
		 */
		'shrink-0 [--outer:20px] [--r:8px] focus:z-10 focus-visible:z-10 active:[--r:4px] data-[size=lg]:[--outer:28px] data-[size=sm]:[--outer:16px] data-[state=on]:not-active:[--r:var(--outer)] pointer-coarse:not-data-[size=lg]:[--outer:22px]',
		'group-data-[spacing=0]/toggle-group:rounded-(--r)',
		'group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-(--outer) group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-(--outer)',
		'group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-(--outer) group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-(--outer)',
		className
	)}
	{value}
	{...restProps}
/>
