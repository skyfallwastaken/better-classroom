<script lang="ts" module>
	import type { VariantProps } from 'tailwind-variants';
	import { tv } from '#lib/utils.js';

	export const tabsListVariants = tv({
		base: 'rounded-full p-1 group-data-horizontal/tabs:h-10 data-[variant=line]:rounded-none data-[variant=line]:p-0 data-[variant=line]:group-data-horizontal/tabs:h-12 group/tabs-list inline-flex w-fit items-center justify-center text-muted-foreground group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col',
		variants: {
			variant: {
				default: 'cn-tabs-list-variant-default bg-surface-container-high',
				line: 'cn-tabs-list-variant-line gap-0 bg-transparent border-b border-outline-variant'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	});

	export type TabsListVariant = VariantProps<typeof tabsListVariants>['variant'];
</script>

<script lang="ts">
	import { Tabs as TabsPrimitive } from 'bits-ui';
	import { cn } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		variant = 'default',
		class: className,
		...restProps
	}: TabsPrimitive.ListProps & {
		variant?: TabsListVariant;
	} = $props();
</script>

<TabsPrimitive.List
	bind:ref
	data-slot="tabs-list"
	data-variant={variant}
	class={cn(tabsListVariants({ variant }), className)}
	{...restProps}
/>
