<script lang="ts" module>
	import type { VariantProps } from 'tailwind-variants';
	import { tv } from '#lib/utils.js';

	export const badgeVariants = tv({
		base: 'h-6 gap-1 rounded-full border border-transparent px-2.5 text-label-md tracking-[0.5px] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-4! group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap transition-colors duration-200 ease-standard outline-none focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-(color:--md-secondary) aria-invalid:border-error [&>svg]:pointer-events-none [a]:state-layer',
		variants: {
			variant: {
				default: 'bg-primary-container text-on-primary-container',
				secondary: 'bg-secondary-container text-on-secondary-container',
				destructive: 'bg-error-container text-on-error-container',
				outline: 'border-outline-variant text-on-surface-variant',
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
