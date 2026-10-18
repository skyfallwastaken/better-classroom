<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import { ChevronRight as ChevronRightIcon } from '@material-symbols-svg/svelte/rounded/icons/chevron-right';
	import { cn } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		inset,
		children,
		...restProps
	}: DropdownMenuPrimitive.SubTriggerProps & {
		inset?: boolean;
	} = $props();
</script>

<DropdownMenuPrimitive.SubTrigger
	bind:ref
	data-slot="dropdown-menu-sub-trigger"
	data-inset={inset}
	class={cn(
		"relative flex min-h-11 shrink-0 cursor-default items-center gap-2 rounded-xs px-3 py-3 text-label-lg text-on-surface outline-hidden transition-[border-radius,background-color] duration-150 ease-standard select-none first:rounded-t-md last:rounded-b-md data-highlighted:bg-on-surface/10 data-inset:ps-10 data-open:bg-on-surface/8 data-disabled:pointer-events-none data-disabled:text-on-surface/38 [&_svg]:pointer-events-none [&_svg]:shrink-0 data-disabled:[&_svg]:text-on-surface/38 [&_svg:not([class*='size-'])]:size-5 [&_svg:not([class*='text-'])]:text-on-surface-variant",
		className
	)}
	{...restProps}
>
	{@render children?.()}
	<ChevronRightIcon class="ml-auto" />
</DropdownMenuPrimitive.SubTrigger>
