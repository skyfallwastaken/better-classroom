<script lang="ts">
	import { Tooltip as TooltipPrimitive } from 'bits-ui';
	import { cn } from '#lib/utils.js';
	import type { WithoutChildrenOrChild } from '#lib/utils.js';
	import TooltipPortal from './tooltip-portal.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		class: className,
		sideOffset = 4,
		side = 'top',
		children,
		arrowClasses,
		portalProps,
		...restProps
	}: TooltipPrimitive.ContentProps & {
		arrowClasses?: string;
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof TooltipPortal>>;
	} = $props();
</script>

<TooltipPortal {...portalProps}>
	<TooltipPrimitive.Content
		bind:ref
		data-slot="tooltip-content"
		{sideOffset}
		{side}
		class={cn(
			'z-50 inline-flex min-h-6 w-fit max-w-50 min-w-10 origin-(--bits-tooltip-content-transform-origin) items-center justify-center gap-1.5 rounded-xs bg-inverse-surface px-2 py-1 text-body-sm text-inverse-on-surface duration-150 ease-standard has-data-[slot=kbd]:pr-1 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-xs data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-80 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-80 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-80',
			className
		)}
		{...restProps}
	>
		{@render children?.()}
		<TooltipPrimitive.Arrow>
			{#snippet child({ props })}
				<div
					class={cn(
						// M3 plain tooltips have no caret; pass arrowClasses (e.g. 'block') to opt back in.
						'z-50 hidden size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-inverse-surface fill-inverse-surface',
						'data-[side=top]:translate-x-1/2 data-[side=top]:translate-y-[calc(-50%+2px)]',
						'data-[side=bottom]:-translate-x-1/2 data-[side=bottom]:-translate-y-[calc(-50%+1px)]',
						'data-[side=right]:translate-x-[calc(50%+2px)] data-[side=right]:translate-y-1/2',
						'data-[side=left]:-translate-y-[calc(50%-3px)]',
						arrowClasses
					)}
					{...props}
				></div>
			{/snippet}
		</TooltipPrimitive.Arrow>
	</TooltipPrimitive.Content>
</TooltipPortal>
