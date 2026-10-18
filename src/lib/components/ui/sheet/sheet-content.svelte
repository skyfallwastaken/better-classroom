<script lang="ts" module>
	export type Side = 'top' | 'right' | 'bottom' | 'left';
</script>

<script lang="ts">
	import { Dialog as SheetPrimitive } from 'bits-ui';
	import { Close as CloseIcon } from '@material-symbols-svg/svelte/rounded/icons/close';
	import { Button } from '#lib/components/ui/button/index.js';
	import { cn, type WithoutChildrenOrChild } from '#lib/utils.js';
	import SheetOverlay from './sheet-overlay.svelte';
	import SheetPortal from './sheet-portal.svelte';
	import type { Snippet } from 'svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		class: className,
		side = 'right',
		showCloseButton = true,
		portalProps,
		children,
		...restProps
	}: WithoutChildrenOrChild<SheetPrimitive.ContentProps> & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof SheetPortal>>;
		side?: Side;
		showCloseButton?: boolean;
		children: Snippet;
	} = $props();
</script>

<SheetPortal {...portalProps}>
	<SheetOverlay />
	<SheetPrimitive.Content
		bind:ref
		data-slot="sheet-content"
		data-side={side}
		class={cn(
			'fixed z-50 flex max-w-[360px] flex-col gap-4 bg-surface-container-low text-body-md text-on-surface shadow-[0_2px_1px_-1px_rgb(0_0_0/0.2),0_1px_1px_0_rgb(0_0_0/0.14),0_1px_3px_0_rgb(0_0_0/0.12)] data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:mx-auto data-[side=bottom]:h-auto data-[side=bottom]:max-h-[calc(100%-4.5rem)] data-[side=bottom]:max-w-[640px] data-[side=bottom]:overflow-y-auto data-[side=bottom]:rounded-t-2xl data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:rounded-r-lg data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:rounded-l-lg data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:max-w-none data-[side=top]:rounded-b-2xl motion-reduce:animate-none data-open:animate-in data-open:duration-400 data-open:ease-standard data-[side=bottom]:data-open:slide-in-from-bottom data-[side=left]:data-open:slide-in-from-left data-[side=right]:data-open:slide-in-from-right data-[side=top]:data-open:slide-in-from-top data-closed:animate-out data-closed:duration-250 data-closed:ease-[cubic-bezier(0.3,0,1,1)] data-[side=bottom]:data-closed:slide-out-to-bottom data-[side=left]:data-closed:slide-out-to-left data-[side=right]:data-closed:slide-out-to-right data-[side=top]:data-closed:slide-out-to-top',
			className
		)}
		{...restProps}
	>
		{@render children?.()}
		{#if showCloseButton}
			<SheetPrimitive.Close data-slot="sheet-close">
				{#snippet child({ props })}
					<Button variant="ghost" class="absolute top-3 right-3" size="icon" {...props}>
						<CloseIcon />
						<span class="sr-only">Close</span>
					</Button>
				{/snippet}
			</SheetPrimitive.Close>
		{/if}
	</SheetPrimitive.Content>
</SheetPortal>
