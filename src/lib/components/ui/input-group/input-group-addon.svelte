<script lang="ts" module>
	import type { VariantProps } from 'tailwind-variants';
	import { tv } from '#lib/utils.js';
	export const inputGroupAddonVariants = tv({
		base: "h-auto gap-2 py-1.5 text-body-lg text-on-surface-variant group-data-[disabled=true]/input-group:opacity-38 group-has-[:disabled]/input-group:opacity-38 [&>kbd]:rounded-xs [&>svg:not([class*='size-'])]:size-6 flex cursor-text items-center justify-center select-none",
		variants: {
			align: {
				'inline-start': 'pl-3 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem] order-first',
				'inline-end': 'pr-3 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem] order-last',
				'block-start':
					'px-4 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2 order-first w-full justify-start',
				'block-end':
					'px-4 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2 order-last w-full justify-start'
			}
		},
		defaultVariants: {
			align: 'inline-start'
		}
	});

	export type InputGroupAddonAlign = VariantProps<typeof inputGroupAddonVariants>['align'];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		align = 'inline-start',
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		align?: InputGroupAddonAlign;
	} = $props();
</script>

<div
	bind:this={ref}
	role="group"
	data-slot="input-group-addon"
	data-align={align}
	class={cn(inputGroupAddonVariants({ align }), className)}
	onclick={(e) => {
		if ((e.target as HTMLElement).closest('button')) {
			return;
		}
		e.currentTarget.parentElement?.querySelector('input')?.focus();
	}}
	{...restProps}
>
	{@render children?.()}
</div>
