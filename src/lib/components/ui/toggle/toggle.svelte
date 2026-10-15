<script lang="ts" module>
	import type { VariantProps } from 'tailwind-variants';
	import { tv } from '#lib/utils.js';

	export const toggleVariants = tv({
		base: "state-layer gap-1.5 rounded-full text-label-lg font-medium text-on-surface-variant transition-[border-radius,background-color,color] duration-300 ease-spring-gentle focus-visible:outline-2 focus-visible:outline-primary aria-pressed:bg-secondary-container aria-pressed:text-on-secondary-container data-[state=on]:bg-secondary-container data-[state=on]:text-on-secondary-container [&_svg:not([class*='size-'])]:size-[1.125rem] group/toggle inline-flex items-center justify-center whitespace-nowrap outline-none disabled:pointer-events-none disabled:opacity-[0.38] [&_svg]:pointer-events-none [&_svg]:shrink-0",
		variants: {
			variant: {
				default: 'bg-transparent',
				outline: 'bg-surface-container-high'
			},
			size: {
				default:
					'h-10 min-w-10 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
				sm: "h-8 min-w-8 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-4",
				lg: 'h-12 min-w-12 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4'
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
