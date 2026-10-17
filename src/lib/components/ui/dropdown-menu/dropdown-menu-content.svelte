<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import { cn, type WithoutChildrenOrChild } from '#lib/utils.js';
	import DropdownMenuPortal from './dropdown-menu-portal.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		sideOffset = 4,
		align = 'start',
		portalProps,
		class: className,
		...restProps
	}: DropdownMenuPrimitive.ContentProps & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof DropdownMenuPortal>>;
	} = $props();
</script>

<DropdownMenuPortal {...portalProps}>
	<DropdownMenuPrimitive.Content
		bind:ref
		data-slot="dropdown-menu-content"
		{sideOffset}
		{align}
		class={cn(
			'z-50 flex w-(--bits-dropdown-menu-anchor-width) min-w-28 flex-col gap-0.5 overflow-x-hidden overflow-y-auto rounded-lg bg-surface-container-high p-1 text-on-surface shadow-[0_3px_3px_-2px_rgb(0_0_0/0.2),0_3px_4px_0_rgb(0_0_0/0.14),0_1px_8px_0_rgb(0_0_0/0.12)] outline-none data-[side=bottom]:origin-top data-[side=left]:origin-right data-[side=right]:origin-left data-[side=top]:origin-bottom motion-reduce:animate-none dark:ring-1 dark:ring-outline-variant data-open:animate-[md-menu-enter_350ms_cubic-bezier(0.27,1.06,0.18,1)] data-closed:animate-[md-menu-exit_100ms_cubic-bezier(0.2,0,0,1)_forwards]',
			className
		)}
		{...restProps}
	/>
</DropdownMenuPortal>

<style>
	/* M3 Expressive menu motion (m3e MenuElement: scaleY 0.8 -> 1 on the fast-spatial spring, 100ms fade). */
	@keyframes -global-md-menu-enter {
		0% {
			opacity: 0;
			transform: scaleY(0.8);
		}
		28% {
			opacity: 1;
		}
		100% {
			opacity: 1;
			transform: scaleY(1);
		}
	}
	@keyframes -global-md-menu-exit {
		to {
			opacity: 0;
			transform: scaleY(0.8);
		}
	}
</style>
