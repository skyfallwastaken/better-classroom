<script lang="ts">
	import { ContextMenu as ContextMenuPrimitive } from 'bits-ui';
	import { cn } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		inset,
		...restProps
	}: ContextMenuPrimitive.GroupHeadingProps & {
		inset?: boolean;
	} = $props();
</script>

<ContextMenuPrimitive.GroupHeading
	bind:ref
	data-slot="context-menu-group-heading"
	data-inset={inset}
	class={cn(
		'flex min-h-8 items-center px-3 text-label-lg text-on-surface-variant data-inset:ps-10',
		className
	)}
	{...restProps}
/>
