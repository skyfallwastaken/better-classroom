<script lang="ts" module>
	import type { VariantProps } from 'tailwind-variants';
	import { cn, tv, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	/*
	 * M3 Expressive common buttons, from Compose material3 tokens (ButtonXSmall/Small/MediumTokens,
	 * XSmall/Small/MediumIconButtonTokens, Filled/Tonal/Outlined/TextButtonTokens, ButtonDefaults):
	 *
	 *            height  padding        gap  icon  label        round -> pressed
	 *   XS       32      12             4    20    label-large  16 -> 8
	 *   S        40      16 (icon: 12)  8    20    label-large  20 -> 8
	 *   M        56      24             8    24    title-medium 28 -> 12
	 *   icon XS  32      6              -    20                 16 -> 8
	 *   icon S   40      8              -    24                 20 -> 8
	 *   icon M   56      16             -    24                 28 -> 12
	 *
	 * `--r` is the resting corner radius: exactly half the height rather than "full", so the
	 * press morph animates over its whole range. `--rp` is the pressed radius. The morph uses
	 * the DefaultEffects spring Compose uses for buttons (no bounce).
	 */
	export const buttonVariants = tv({
		base: 'state-layer rounded-(--r) border border-transparent bg-clip-padding text-label-lg tracking-[0.1px] [transition:border-radius_var(--duration-spring-default-effects)_var(--ease-spring-default-effects),background-color_200ms_var(--ease-standard),color_200ms_var(--ease-standard),box-shadow_200ms_var(--ease-standard)] focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-(color:--md-secondary) focus-visible:animate-focus-ring active:not-aria-[haspopup]:rounded-(--rp) aria-invalid:border-destructive group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap outline-none select-none disabled:pointer-events-none disabled:text-on-surface-variant/38 disabled:shadow-none aria-disabled:pointer-events-none aria-disabled:text-on-surface-variant/38 [&_svg]:pointer-events-none [&_svg]:shrink-0',
		variants: {
			variant: {
				// Filled and tonal rise to elevation level 1 on hover, back to 0 when pressed.
				default:
					'bg-primary text-on-primary hover:shadow-[0_1px_2px_0_rgb(0_0_0/0.3),0_1px_3px_1px_rgb(0_0_0/0.15)] active:shadow-none disabled:bg-on-surface/10 aria-disabled:bg-on-surface/10',
				outline:
					'border-outline-variant bg-transparent text-on-surface-variant disabled:border-outline-variant/10 aria-disabled:border-outline-variant/10 aria-expanded:bg-secondary-container aria-expanded:text-on-secondary-container',
				secondary:
					'bg-secondary-container text-on-secondary-container hover:shadow-[0_1px_2px_0_rgb(0_0_0/0.3),0_1px_3px_1px_rgb(0_0_0/0.15)] active:shadow-none disabled:bg-on-surface/10 aria-disabled:bg-on-surface/10 aria-expanded:bg-secondary-container',
				ghost:
					'text-on-surface-variant aria-expanded:bg-secondary-container aria-expanded:text-on-secondary-container',
				destructive:
					'bg-error-container text-on-error-container disabled:bg-on-surface/10 aria-disabled:bg-on-surface/10',
				link: 'text-primary underline-offset-4 before:hidden hover:underline'
			},
			size: {
				default:
					"h-10 gap-2 px-4 [--r:20px] [--rp:8px] pointer-coarse:h-11 pointer-coarse:[--r:22px] has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 pointer-coarse:has-data-[icon=inline-end]:pr-4 pointer-coarse:has-data-[icon=inline-start]:pl-4 [&_svg:not([class*='size-'])]:size-5",
				xs: "h-8 gap-1 px-3 [--r:16px] [--rp:8px] pointer-coarse:h-11 pointer-coarse:[--r:22px] [&_svg:not([class*='size-'])]:size-5",
				sm: "h-8 gap-1 px-3 [--r:16px] [--rp:8px] pointer-coarse:h-11 pointer-coarse:[--r:22px] [&_svg:not([class*='size-'])]:size-5",
				lg: "h-14 gap-2 px-6 text-title-md tracking-[0.15px] [--r:28px] [--rp:12px] [&_svg:not([class*='size-'])]:size-6",
				icon: "size-10 [--r:20px] [--rp:8px] pointer-coarse:size-11 pointer-coarse:[--r:22px] [&_svg:not([class*='size-'])]:size-6",
				'icon-xs':
					"size-8 [--r:16px] [--rp:8px] pointer-coarse:size-11 pointer-coarse:[--r:22px] [&_svg:not([class*='size-'])]:size-5",
				'icon-sm':
					"size-8 [--r:16px] [--rp:8px] pointer-coarse:size-11 pointer-coarse:[--r:22px] [&_svg:not([class*='size-'])]:size-5",
				'icon-lg': "size-14 [--r:28px] [--rp:12px] [&_svg:not([class*='size-'])]:size-6"
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
