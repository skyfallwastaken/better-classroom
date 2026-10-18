<script lang="ts" module>
	import type { VariantProps } from 'tailwind-variants';
	import { tv } from '#lib/utils.js';

	/*
	 * M3 Expressive toggle button (Compose ToggleButton / ToggleButtonDefaults with
	 * ButtonXSmall/Small/MediumTokens and FilledButtonTokens):
	 *
	 *        height  padding        gap  icon  round -> pressed -> checked
	 *   sm   32      12             4    20    16 -> 8 -> 12           (XS)
	 *   md   40      16 (icon: 12)  8    20    20 -> 6 -> 12           (S)
	 *   lg   56      24             8    24    28 -> 12 -> 16          (M)
	 *
	 * Unselected: `outline` is Compose's filled toggle (surface-container, on-surface-variant),
	 * `default` drops the container. Selected: primary / on-primary. Disabled: on-surface 10%
	 * container, on-surface-variant 38% content. The shape morphs with the FastSpatial spring.
	 * Only the corners and colours change between states, never the size.
	 */
	export const toggleVariants = tv({
		base: 'state-layer disabled:data-[state=on]:bg-on-surface/10 disabled:data-[state=on]:text-on-surface-variant/38 rounded-(--tr) [--tr:var(--round)] data-[state=on]:not-active:[--tr:var(--checked)] active:[--tr:var(--pressed)] text-label-lg tracking-[0.1px] text-on-surface-variant [transition:border-radius_var(--duration-spring-fast-spatial)_var(--ease-spring-fast-spatial),background-color_200ms_var(--ease-standard),color_200ms_var(--ease-standard)] focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-(color:--md-secondary) focus-visible:animate-focus-ring aria-pressed:bg-primary aria-pressed:text-on-primary data-[state=on]:bg-primary data-[state=on]:text-on-primary group/toggle inline-flex items-center justify-center whitespace-nowrap outline-none select-none disabled:pointer-events-none disabled:text-on-surface-variant/38 [&_svg]:pointer-events-none [&_svg]:shrink-0',
		variants: {
			variant: {
				default: 'bg-transparent',
				outline: 'bg-surface-container disabled:bg-on-surface/10'
			},
			size: {
				default:
					"h-10 min-w-10 gap-2 px-4 [--round:20px] [--pressed:6px] [--checked:12px] pointer-coarse:h-11 pointer-coarse:min-w-11 pointer-coarse:[--round:22px] has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 pointer-coarse:has-data-[icon=inline-end]:pr-4 pointer-coarse:has-data-[icon=inline-start]:pl-4 [&_svg:not([class*='size-'])]:size-5",
				sm: "h-8 min-w-8 gap-1 px-3 [--round:16px] [--pressed:8px] [--checked:12px] pointer-coarse:h-11 pointer-coarse:min-w-11 pointer-coarse:[--round:22px] [&_svg:not([class*='size-'])]:size-5",
				lg: "h-14 min-w-14 gap-2 px-6 text-title-md tracking-[0.15px] [--round:28px] [--pressed:12px] [--checked:16px] [&_svg:not([class*='size-'])]:size-6"
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});

	export type ToggleVariant = VariantProps<typeof toggleVariants>['variant'];
	export type ToggleSize = VariantProps<typeof toggleVariants>['size'];
	export type ToggleVariants = VariantProps<typeof toggleVariants>;
</script>

<script lang="ts">
	import { Toggle as TogglePrimitive } from 'bits-ui';
	import { cn } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		pressed = $bindable(false),
		class: className,
		size = 'default',
		variant = 'default',
		...restProps
	}: TogglePrimitive.RootProps & {
		variant?: ToggleVariant;
		size?: ToggleSize;
	} = $props();
</script>

<TogglePrimitive.Root
	bind:ref
	bind:pressed
	data-slot="toggle"
	class={cn(toggleVariants({ variant, size }), className)}
	{...restProps}
/>
