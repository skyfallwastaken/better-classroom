<script lang="ts" module>
	import type { VariantProps } from 'tailwind-variants';
	import { tv } from '#lib/utils.js';

	export const sidebarMenuButtonVariants = tv({
		base: 'state-layer gap-3 rounded-full px-4 text-left text-label-lg font-medium text-on-surface-variant transition-[background-color,color,border-radius] duration-300 ease-spring-gentle group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-has-data-[sidebar=menu-badge]/menu-item:pr-12 group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:p-2! focus-visible:outline-2 focus-visible:outline-primary active:rounded-lg data-active:bg-secondary-container data-active:text-on-secondary-container peer/menu-button group/menu-button flex w-full items-center overflow-hidden outline-hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:size-6 [&_svg]:shrink-0 [&>span:last-child]:truncate',
		variants: {
			variant: {
				default: '',
				outline:
					'bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]'
			},
			size: {
				default: 'h-12',
				sm: 'h-9 text-label-md',
				lg: 'h-14 group-data-[collapsible=icon]:p-0!'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});

	export type SidebarMenuButtonVariant = VariantProps<typeof sidebarMenuButtonVariants>['variant'];
	export type SidebarMenuButtonSize = VariantProps<typeof sidebarMenuButtonVariants>['size'];
</script>

<script lang="ts">
	import { mergeProps } from 'bits-ui';
	import * as Tooltip from '#lib/components/ui/tooltip/index.js';
	import { cn, type WithElementRef, type WithoutChildrenOrChild } from '#lib/utils.js';
	import { useSidebar } from './context.svelte.js';
	import type { ComponentProps, Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		child,
		variant = 'default',
		size = 'default',
		isActive = false,
		tooltipContent,
		tooltipContentProps,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
		isActive?: boolean;
		variant?: SidebarMenuButtonVariant;
		size?: SidebarMenuButtonSize;
		tooltipContent?: Snippet | string;
		tooltipContentProps?: WithoutChildrenOrChild<ComponentProps<typeof Tooltip.Content>>;
		child?: Snippet<[{ props: Record<string, unknown> }]>;
	} = $props();

	const sidebar = useSidebar();

	const buttonProps = $derived({
		class: cn(sidebarMenuButtonVariants({ variant, size }), className),
		'data-slot': 'sidebar-menu-button',
		'data-sidebar': 'menu-button',
		'data-size': size,
		'data-active': isActive,
		...restProps
	});
</script>

{#snippet Button({ props }: { props?: Record<string, unknown> })}
	{@const mergedProps = mergeProps(buttonProps, props)}
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<button bind:this={ref} {...mergedProps}>
			{@render children?.()}
		</button>
	{/if}
{/snippet}

{#if !tooltipContent}
	{@render Button({})}
{:else}
	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child({ props })}
				{@render Button({ props })}
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content
			side="right"
			align="center"
			hidden={sidebar.state !== 'collapsed' || sidebar.isMobile}
			{...tooltipContentProps}
		>
			{#if typeof tooltipContent === 'string'}
				{tooltipContent}
			{:else if tooltipContent}
				{@render tooltipContent()}
			{/if}
		</Tooltip.Content>
	</Tooltip.Root>
{/if}
