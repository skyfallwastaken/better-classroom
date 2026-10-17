<script lang="ts">
	import { Popover as PopoverPrimitive } from 'bits-ui';
	import { cn, type WithoutChildrenOrChild } from '#lib/utils.js';
	import PopoverPortal from './popover-portal.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		class: className,
		sideOffset = 4,
		align = 'center',
		portalProps,
		...restProps
	}: PopoverPrimitive.ContentProps & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof PopoverPortal>>;
	} = $props();
</script>

<PopoverPortal {...portalProps}>
	<PopoverPrimitive.Content
		bind:ref
		data-slot="popover-content"
		{sideOffset}
		{align}
		class={cn(
			'z-50 flex w-72 origin-(--bits-popover-content-transform-origin) flex-col gap-3 rounded-lg bg-surface-container-high p-4 text-body-md text-on-surface-variant shadow-[0_3px_3px_-2px_rgb(0_0_0/0.2),0_3px_4px_0_rgb(0_0_0/0.14),0_1px_8px_0_rgb(0_0_0/0.12)] outline-hidden duration-150 ease-standard dark:ring-1 dark:ring-outline-variant data-open:animate-in data-open:fade-in-0 data-open:zoom-in-80 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-80',
			className
		)}
		{...restProps}
	/>
</PopoverPortal>
