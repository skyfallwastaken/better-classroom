<script lang="ts">
	import { ContextMenu as ContextMenuPrimitive } from 'bits-ui';
	import { Check as CheckIcon } from '@material-symbols-svg/svelte/rounded/icons/check';
	import { Remove as RemoveIcon } from '@material-symbols-svg/svelte/rounded/icons/remove';
	import { cn, type WithoutChildrenOrChild } from '#lib/utils.js';
	import type { Snippet } from 'svelte';

	let {
		ref = $bindable(null),
		checked = $bindable(false),
		indeterminate = $bindable(false),
		class: className,
		inset,
		children: childrenProp,
		...restProps
	}: WithoutChildrenOrChild<ContextMenuPrimitive.CheckboxItemProps> & {
		inset?: boolean;
		children?: Snippet;
	} = $props();
</script>

<ContextMenuPrimitive.CheckboxItem
	bind:ref
	bind:checked
	bind:indeterminate
	data-slot="context-menu-checkbox-item"
	data-inset={inset}
	class={cn(
		"relative flex min-h-11 shrink-0 cursor-default items-center gap-2 rounded-xs px-3 py-3 text-label-lg text-on-surface outline-hidden transition-[border-radius,background-color] duration-150 ease-standard select-none first:rounded-t-md last:rounded-b-md data-highlighted:bg-on-surface/10 data-inset:ps-10 data-[state=checked]:rounded-md data-[state=checked]:bg-secondary-container data-[state=checked]:text-on-secondary-container data-[state=checked]:data-highlighted:bg-[color-mix(in_srgb,var(--md-secondary-container),var(--md-on-secondary-container)_10%)] data-disabled:pointer-events-none data-disabled:text-on-surface/38 [&_svg]:pointer-events-none [&_svg]:shrink-0 data-disabled:[&_svg]:text-on-surface/38 [&_svg:not([class*='size-'])]:size-5 [&_svg:not([class*='text-'])]:text-on-surface-variant data-[state=checked]:[&_svg:not([class*='text-'])]:text-on-secondary-container",
		className
	)}
	{...restProps}
>
	{#snippet children({ checked, indeterminate })}
		<span class="pointer-events-none flex size-5 shrink-0 items-center justify-center">
			{#if checked || indeterminate}
				<span class="flex animate-in duration-150 ease-standard fade-in-0 zoom-in-50">
					{#if indeterminate}
						<RemoveIcon />
					{:else}
						<CheckIcon />
					{/if}
				</span>
			{/if}
		</span>
		{@render childrenProp?.()}
	{/snippet}
</ContextMenuPrimitive.CheckboxItem>
