<script lang="ts" module>
	import type { VariantProps } from 'tailwind-variants';
	import { tv } from '#lib/utils.js';

	export const itemVariants = tv({
		// M3 list item (Compose ListTokens): body-large label on on-surface, 16px leading and trailing
		// space, 12px between slots, 10px top/bottom; links get an on-surface state layer.
		base: 'border text-body-lg text-on-surface [a]:state-layer group/item flex w-full flex-wrap items-center outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-2 focus-visible:outline-primary',
		variants: {
			variant: {
				default: 'border-transparent',
				outline: 'rounded-md border-outline-variant',
				muted: 'rounded-md border-transparent bg-surface-container-low'
			},
			size: {
				default: 'min-h-14 gap-3 px-4 py-2.5',
				sm: 'gap-3 px-4 py-2.5',
				xs: 'gap-2 px-2.5 py-2 in-data-[slot=dropdown-menu-content]:p-0'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});

	export type ItemSize = VariantProps<typeof itemVariants>['size'];
	export type ItemVariant = VariantProps<typeof itemVariants>['variant'];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		child,
		variant,
		size,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		child?: Snippet<[{ props: Record<string, unknown> }]>;
		variant?: ItemVariant;
		size?: ItemSize;
	} = $props();

	const mergedProps = $derived({
		class: cn(itemVariants({ variant, size }), className),
		'data-slot': 'item',
		'data-variant': variant,
		'data-size': size,
		...restProps
	});
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div bind:this={ref} {...mergedProps}>
		{@render mergedProps.children?.()}
	</div>
{/if}
