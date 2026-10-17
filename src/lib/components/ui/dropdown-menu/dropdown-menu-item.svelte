<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import { cn } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		inset,
		variant = 'default',
		...restProps
	}: DropdownMenuPrimitive.ItemProps & {
		inset?: boolean;
		variant?: 'default' | 'destructive';
	} = $props();
</script>

<DropdownMenuPrimitive.Item
	bind:ref
	data-slot="dropdown-menu-item"
	data-inset={inset}
	data-variant={variant}
	class={cn(
		"group/dropdown-menu-item relative flex min-h-11 shrink-0 cursor-default items-center gap-2 rounded-xs px-3 py-3 text-label-lg text-on-surface outline-hidden transition-[border-radius,background-color] duration-150 ease-standard select-none first:rounded-t-md last:rounded-b-md data-highlighted:bg-on-surface/10 data-inset:pl-10 data-[variant=destructive]:text-error data-[variant=destructive]:data-highlighted:bg-error/10 data-disabled:pointer-events-none data-disabled:text-on-surface/38 [&_svg]:pointer-events-none [&_svg]:shrink-0 data-disabled:[&_svg]:text-on-surface/38 [&_svg:not([class*='size-'])]:size-5 [&_svg:not([class*='text-'])]:text-on-surface-variant data-[variant=destructive]:[&_svg:not([class*='text-'])]:text-error",
		className
	)}
	{...restProps}
/>
