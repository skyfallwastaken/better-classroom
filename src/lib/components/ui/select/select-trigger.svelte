<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import { ArrowDropDown as ArrowDropDownIcon } from '@material-symbols-svg/svelte/rounded/icons/arrow-drop-down';
	import { cn, type WithoutChild } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		children,
		size = 'default',
		...restProps
	}: WithoutChild<SelectPrimitive.TriggerProps> & {
		size?: 'sm' | 'default';
	} = $props();
</script>

<SelectPrimitive.Trigger
	bind:ref
	data-slot="select-trigger"
	data-size={size}
	class={cn(
		"flex w-fit items-center justify-between gap-2 rounded-xs border border-outline bg-transparent py-2 pr-3 pl-4 text-body-lg whitespace-nowrap text-on-surface transition-[border-color,box-shadow] duration-150 ease-standard outline-none select-none hover:border-on-surface focus-visible:border-primary focus-visible:shadow-[inset_0_0_0_1px_var(--md-primary)] disabled:cursor-not-allowed disabled:border-on-surface/12 disabled:text-on-surface/38 aria-invalid:border-error aria-invalid:hover:border-on-error-container data-placeholder:text-on-surface-variant data-[size=default]:h-14 data-[size=sm]:h-10 data-[size=sm]:pl-3 data-[size=sm]:text-body-md *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 data-[state=open]:border-primary data-[state=open]:shadow-[inset_0_0_0_1px_var(--md-primary)] [&_svg]:pointer-events-none [&_svg]:shrink-0 disabled:[&_svg]:text-on-surface/38 [&_svg:not([class*='size-'])]:size-6 [&_svg:not([class*='text-'])]:text-on-surface-variant",
		className
	)}
	{...restProps}
>
	{@render children?.()}
	<ArrowDropDownIcon
		class="pointer-events-none size-6 text-on-surface-variant transition-transform duration-350 ease-[cubic-bezier(0.27,1.06,0.18,1)] in-data-[state=open]:rotate-180"
	/>
</SelectPrimitive.Trigger>
