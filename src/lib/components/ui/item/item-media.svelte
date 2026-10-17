<script lang="ts" module>
	import type { VariantProps } from 'tailwind-variants';
	import { tv } from '#lib/utils.js';

	export const itemMediaVariants = tv({
		base: 'gap-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none',
		variants: {
			variant: {
				default: 'bg-transparent',
				icon: "text-on-surface-variant [&_svg:not([class*='size-'])]:size-6",
				image:
					'size-14 overflow-hidden rounded-sm group-data-[size=sm]/item:size-10 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	});

	export type ItemMediaVariant = VariantProps<typeof itemMediaVariants>['variant'];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		variant = 'default',
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & { variant?: ItemMediaVariant } = $props();
</script>

<div
	bind:this={ref}
	data-slot="item-media"
	data-variant={variant}
	class={cn(itemMediaVariants({ variant }), className)}
	{...restProps}
>
	{@render children?.()}
</div>
