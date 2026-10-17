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
		"state-layer relative inline-flex h-full flex-1 items-center justify-center gap-1.5 rounded-full px-4 text-title-sm font-medium whitespace-nowrap text-on-surface-variant transition-[color,background-color] duration-200 group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start focus-visible:outline-2 focus-visible:outline-primary group-data-[variant=line]/tabs-list:focus-visible:-outline-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
		'group-data-[variant=default]/tabs-list:data-active:bg-secondary-container group-data-[variant=default]/tabs-list:data-active:text-on-secondary-container',
		// M3 primary tabs (Compose PrimaryNavigationTabTokens): 48px tall, title-small label,
		// 16px horizontal padding, on-surface-variant label that turns on-surface on hover and
		// primary when active; on-surface state layer (primary when active).
		'group-data-[variant=line]/tabs-list:rounded-none group-data-[variant=line]/tabs-list:px-4 group-data-[variant=line]/tabs-list:hover:text-on-surface group-data-[variant=line]/tabs-list:data-active:text-primary',
		// Active indicator: 3px primary bar with 3px top corners, as wide as the label (min 24px),
		// growing from the centre under the label, or beside it when vertical.
		'after:absolute after:bg-primary after:transition-transform after:duration-300 after:ease-spring-gentle group-data-[variant=default]/tabs-list:after:hidden',
		'group-data-[orientation=horizontal]/tabs:after:bottom-0 group-data-[orientation=horizontal]/tabs:after:left-1/2 group-data-[orientation=horizontal]/tabs:after:h-[3px] group-data-[orientation=horizontal]/tabs:after:w-[max(24px,calc(100%-32px))] group-data-[orientation=horizontal]/tabs:after:-translate-x-1/2 group-data-[orientation=horizontal]/tabs:after:scale-x-0 group-data-[orientation=horizontal]/tabs:after:rounded-t-[3px] group-data-[orientation=horizontal]/tabs:data-active:after:scale-x-100',
		'group-data-[orientation=vertical]/tabs:after:inset-y-2 group-data-[orientation=vertical]/tabs:after:right-0 group-data-[orientation=vertical]/tabs:after:w-[3px] group-data-[orientation=vertical]/tabs:after:scale-y-0 group-data-[orientation=vertical]/tabs:after:rounded-l-[3px] group-data-[orientation=vertical]/tabs:data-active:after:scale-y-100',
		className
	)}
	{...restProps}
/>
