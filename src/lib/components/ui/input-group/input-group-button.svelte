<script lang="ts" module>
	import type { VariantProps } from 'tailwind-variants';
	import { tv } from '#lib/utils.js';

	const inputGroupButtonVariants = tv({
		base: 'gap-2 text-label-lg flex items-center shadow-none',
		variants: {
			size: {
				xs: "h-8 gap-1 rounded-full px-3 [&>svg:not([class*='size-'])]:size-5",
				sm: 'cn-input-group-button-size-sm',
				'icon-xs': 'size-8 rounded-full p-0 has-[>svg]:p-0',
				'icon-sm': 'size-10 rounded-full p-0 has-[>svg]:p-0'
			}
		},
		defaultVariants: {
			size: 'xs'
		}
	});

	export type InputGroupButtonSize = VariantProps<typeof inputGroupButtonVariants>['size'];
</script>

<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.js';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		class: className,
		children,
		type = 'button',
		variant = 'ghost',
		size = 'xs',
		...restProps
	}: Omit<ComponentProps<typeof Button>, 'href' | 'size'> & {
		size?: InputGroupButtonSize;
	} = $props();
</script>

<Button
	bind:ref
	{type}
	data-size={size}
	{variant}
	class={cn(inputGroupButtonVariants({ size }), className)}
	{...restProps}
>
	{@render children?.()}
</Button>
