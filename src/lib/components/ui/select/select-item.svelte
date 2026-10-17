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
		"relative flex min-h-11 w-full shrink-0 cursor-default items-center gap-1.5 rounded-md py-2 pr-10 pl-3 text-label-lg text-on-surface outline-hidden select-none data-highlighted:bg-on-surface/10 data-selected:bg-secondary-container data-selected:text-on-secondary-container data-selected:data-highlighted:bg-[color-mix(in_srgb,var(--md-secondary-container),var(--md-on-secondary-container)_10%)] data-[disabled]:pointer-events-none data-[disabled]:opacity-[0.38] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
		className
	)}
	{...restProps}
>
	{#snippet children({ selected, highlighted })}
		<span class="absolute end-3 flex size-5 items-center justify-center">
			{#if selected}
				<CheckIcon class="cn-select-item-indicator-icon" />
			{/if}
		</span>
		<span class="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
			{#if childrenProp}
				{@render childrenProp({ selected, highlighted })}
			{:else}
				{label || value}
			{/if}
		</span>
	{/snippet}
</SelectPrimitive.Item>
