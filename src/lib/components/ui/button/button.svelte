<script lang="ts" module>
	import type { VariantProps } from 'tailwind-variants';
	import { cn, tv, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	export const buttonVariants = tv({
		// M3 Expressive: fully round at rest, morphing toward a rounded square while pressed.
		base: "state-layer rounded-full border border-transparent bg-clip-padding text-label-lg font-medium transition-[border-radius,background-color,color,box-shadow] duration-300 ease-spring-gentle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:not-aria-[haspopup]:rounded-md aria-invalid:border-destructive [&_svg:not([class*='size-'])]:size-[1.125rem] group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap outline-none select-none disabled:pointer-events-none disabled:opacity-[0.38] [&_svg]:pointer-events-none [&_svg]:shrink-0",
		variants: {
			variant: {
				default: 'bg-primary text-on-primary hover:shadow-sm',
				outline:
					'border-outline-variant bg-transparent text-on-surface-variant aria-expanded:bg-secondary-container aria-expanded:text-on-secondary-container',
				secondary:
					'bg-secondary-container text-on-secondary-container aria-expanded:bg-secondary-container',
				ghost:
					'text-on-surface-variant aria-expanded:bg-secondary-container aria-expanded:text-on-secondary-container',
				destructive: 'bg-error-container text-on-error-container',
				link: 'text-primary underline-offset-4 before:hidden hover:underline'
			},
			size: {
				default:
					'h-10 gap-2 px-6 pointer-coarse:h-11 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4',
				xs: "h-7 pointer-coarse:h-11 gap-1 px-3 text-label-md active:not-aria-[haspopup]:rounded-sm has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
				sm: "h-8 pointer-coarse:h-11 gap-1.5 px-4 active:not-aria-[haspopup]:rounded-sm has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-4",
				lg: "h-14 gap-2 px-7 text-title-md active:not-aria-[haspopup]:rounded-lg has-data-[icon=inline-end]:pr-6 has-data-[icon=inline-start]:pl-6 [&_svg:not([class*='size-'])]:size-6",
				icon: 'size-10 pointer-coarse:size-11 [&_svg:not([class*=size-])]:size-6',
				'icon-xs':
					"size-7 pointer-coarse:size-11 active:not-aria-[haspopup]:rounded-sm [&_svg:not([class*='size-'])]:size-4",
				'icon-sm':
					"size-8 pointer-coarse:size-11 active:not-aria-[haspopup]:rounded-sm [&_svg:not([class*='size-'])]:size-5",
				'icon-lg':
					"size-12 active:not-aria-[haspopup]:rounded-lg [&_svg:not([class*='size-'])]:size-6"
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
	export type ButtonSize = VariantProps<typeof buttonVariants>['size'];

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
		};
</script>

<script lang="ts">
	let {
		class: className,
		variant = 'default',
		size = 'default',
		ref = $bindable(null),
		href = undefined,
		type = 'button',
		disabled,
		children,
		...restProps
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		href={disabled ? undefined : href}
		aria-disabled={disabled}
		role={disabled ? 'link' : undefined}
		tabindex={disabled ? -1 : undefined}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		{type}
		{disabled}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}
