<script lang="ts" module>
	import type { VariantProps } from 'tailwind-variants';
	import { tv } from '#lib/utils.js';

	export const badgeVariants = tv({
		base: 'h-6 gap-1 rounded-full border border-transparent px-2.5 py-0.5 text-label-md font-medium transition-all has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3! group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none',
		variants: {
			variant: {
				default: 'bg-primary-container text-on-primary-container [a]:hover:bg-primary-container/80',
				secondary:
					'bg-secondary-container text-on-secondary-container [a]:hover:bg-secondary-container/80',
				destructive:
					'bg-error-container text-on-error-container focus-visible:ring-destructive/20 [a]:hover:bg-error-container/80',
				outline: 'border-outline-variant text-on-surface-variant [a]:hover:bg-muted',
				ghost: 'hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50',
				link: 'text-primary underline-offset-4 hover:underline'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	});

	export type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		href,
		class: className,
		variant = 'default',
		children,
		...restProps
	}: WithElementRef<HTMLAnchorAttributes> & {
		variant?: BadgeVariant;
	} = $props();
</script>

<svelte:element
	this={href ? 'a' : 'span'}
	bind:this={ref}
	data-slot="badge"
	{href}
	class={cn(badgeVariants({ variant }), className)}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
