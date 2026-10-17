<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import { cn, type WithoutChild } from '#lib/utils.js';
	import type { WithoutChildrenOrChild } from '#lib/utils.js';
	import SelectPortal from './select-portal.svelte';
	import SelectScrollDownButton from './select-scroll-down-button.svelte';
	import SelectScrollUpButton from './select-scroll-up-button.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		class: className,
		sideOffset = 4,
		portalProps,
		children,
		preventScroll = true,
		...restProps
	}: WithoutChild<SelectPrimitive.ContentProps> & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof SelectPortal>>;
	} = $props();
</script>

<SelectPortal {...portalProps}>
	<SelectPrimitive.Content
		bind:ref
		{sideOffset}
		{preventScroll}
		data-slot="select-content"
		class={cn(
			'relative isolate z-50 min-w-28 overflow-x-hidden overflow-y-auto rounded-lg bg-surface-container-high text-on-surface shadow-[0_3px_3px_-2px_rgb(0_0_0/0.2),0_3px_4px_0_rgb(0_0_0/0.14),0_1px_8px_0_rgb(0_0_0/0.12)] outline-none data-[side=bottom]:origin-top data-[side=left]:origin-right data-[side=right]:origin-left data-[side=top]:origin-bottom motion-reduce:animate-none dark:ring-1 dark:ring-outline-variant data-open:animate-[md-menu-enter_350ms_cubic-bezier(0.27,1.06,0.18,1)] data-closed:animate-[md-menu-exit_100ms_cubic-bezier(0.2,0,0,1)_forwards]',
			className
		)}
		{...restProps}
	>
		<SelectScrollUpButton />
		<SelectPrimitive.Viewport
			class={cn(
				'flex h-(--bits-select-anchor-height) w-full min-w-(--bits-select-anchor-width) scroll-my-1 flex-col gap-0.5 p-1'
			)}
		>
			{@render children?.()}
		</SelectPrimitive.Viewport>
		<SelectScrollDownButton />
	</SelectPrimitive.Content>
</SelectPortal>

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
