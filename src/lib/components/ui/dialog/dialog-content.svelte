<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import { Close as CloseIcon } from '@material-symbols-svg/svelte/rounded/icons/close';
	import { Button } from '#lib/components/ui/button/index.js';
	import { cn, type WithoutChildrenOrChild } from '#lib/utils.js';
	import * as Dialog from './index.js';
	import DialogPortal from './dialog-portal.svelte';
	import type { Snippet } from 'svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		class: className,
		portalProps,
		children,
		showCloseButton = true,
		overlayClass,
		...restProps
	}: WithoutChildrenOrChild<DialogPrimitive.ContentProps> & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof DialogPortal>>;
		children: Snippet;
		showCloseButton?: boolean;
		overlayClass?: string;
	} = $props();
</script>

<DialogPortal {...portalProps}>
	<Dialog.Overlay class={overlayClass} />
	<DialogPrimitive.Content
		bind:ref
		data-slot="dialog-content"
		class={cn(
			'fixed top-1/2 left-1/2 z-50 grid w-full max-w-[min(560px,calc(100%-3rem))] min-w-[min(280px,calc(100%-3rem))] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-2xl bg-surface-container-high p-6 text-body-md text-on-surface-variant shadow-[0_3px_5px_-1px_rgb(0_0_0/0.2),0_6px_10px_0_rgb(0_0_0/0.14),0_1px_18px_0_rgb(0_0_0/0.12)] outline-none motion-reduce:animate-none data-open:animate-in data-open:duration-500 data-open:ease-emphasized data-open:fade-in-0 data-open:slide-in-from-top-[50px] data-closed:animate-out data-closed:duration-150 data-closed:ease-[cubic-bezier(0.3,0,0.8,0.15)] data-closed:fade-out-0 data-closed:slide-out-to-top-[50px]',
			className
		)}
		{...restProps}
	>
		{@render children?.()}
		{#if showCloseButton}
			<DialogPrimitive.Close data-slot="dialog-close">
				{#snippet child({ props })}
					<Button variant="ghost" class="absolute top-4 right-4" size="icon" {...props}>
						<CloseIcon />
						<span class="sr-only">Close</span>
					</Button>
				{/snippet}
			</DialogPrimitive.Close>
		{/if}
	</DialogPrimitive.Content>
</DialogPortal>
