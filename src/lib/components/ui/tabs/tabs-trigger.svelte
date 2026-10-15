<script lang="ts">
	import { Tabs as TabsPrimitive } from 'bits-ui';
	import { cn } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: TabsPrimitive.TriggerProps = $props();
</script>

<TabsPrimitive.Trigger
	bind:ref
	data-slot="tabs-trigger"
	class={cn(
		"state-layer relative inline-flex h-full flex-1 items-center justify-center gap-1.5 rounded-full px-4 text-title-sm font-medium whitespace-nowrap text-on-surface-variant transition-[color,background-color] duration-200 group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start focus-visible:outline-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
		'group-data-[variant=default]/tabs-list:data-active:bg-secondary-container group-data-[variant=default]/tabs-list:data-active:text-on-secondary-container',
		'group-data-[variant=line]/tabs-list:rounded-none group-data-[variant=line]/tabs-list:px-5 group-data-[variant=line]/tabs-list:data-active:text-primary',
		'after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:scale-x-0 after:rounded-t-full after:bg-primary after:transition-transform after:duration-300 after:ease-spring-gentle group-data-[variant=default]/tabs-list:after:hidden group-data-[variant=line]/tabs-list:data-active:after:scale-x-100',
		className
	)}
	{...restProps}
/>
