<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import { Check as CheckIcon } from '@material-symbols-svg/svelte/rounded/icons/check';
	import { cn, type WithoutChild } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		value,
		label,
		children: childrenProp,
		...restProps
	}: WithoutChild<SelectPrimitive.ItemProps> = $props();
</script>

<SelectPrimitive.Item
	bind:ref
	{value}
	data-slot="select-item"
	class={cn(
		"relative flex min-h-11 w-full shrink-0 cursor-default items-center gap-2 rounded-xs px-3 py-3 text-label-lg text-on-surface outline-hidden transition-[border-radius,background-color] duration-150 ease-standard select-none first:rounded-t-md last:rounded-b-md data-highlighted:bg-on-surface/10 data-selected:rounded-md data-selected:bg-secondary-container data-selected:text-on-secondary-container data-selected:data-highlighted:bg-[color-mix(in_srgb,var(--md-secondary-container),var(--md-on-secondary-container)_10%)] data-disabled:pointer-events-none data-disabled:text-on-surface/38 [&_svg]:pointer-events-none [&_svg]:shrink-0 data-disabled:[&_svg]:text-on-surface/38 [&_svg:not([class*='size-'])]:size-5 [&_svg:not([class*='text-'])]:text-on-surface-variant data-selected:[&_svg:not([class*='text-'])]:text-on-secondary-container *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
		className
	)}
	{...restProps}
>
	{#snippet children({ selected, highlighted })}
		<!-- M3 Expressive selectable menu item: the check leads the label in a reserved slot so labels never shift -->
		<span class="flex size-5 shrink-0 items-center justify-center">
			{#if selected}
				<CheckIcon
					class="cn-select-item-indicator-icon animate-in duration-150 ease-standard fade-in-0 zoom-in-50"
				/>
			{/if}
		</span>
		<span class="flex min-w-0 flex-1 shrink-0 gap-2 whitespace-nowrap">
			{#if childrenProp}
				{@render childrenProp({ selected, highlighted })}
			{:else}
				{label || value}
			{/if}
		</span>
	{/snippet}
</SelectPrimitive.Item>
