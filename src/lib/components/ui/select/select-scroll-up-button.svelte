<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import { KeyboardArrowUp as KeyboardArrowUpIcon } from '@material-symbols-svg/svelte/rounded/icons/keyboard-arrow-up';
	import { cn, type WithoutChildrenOrChild } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildrenOrChild<SelectPrimitive.ScrollUpButtonProps> = $props();
</script>

<SelectPrimitive.ScrollUpButton
	bind:ref
	data-slot="select-scroll-up-button"
	class={cn(
		"top-0 z-10 flex w-full cursor-default items-center justify-center bg-surface-container-high py-1 text-on-surface-variant [&_svg:not([class*='size-'])]:size-5",
		className
	)}
	{...restProps}
>
	<KeyboardArrowUpIcon />
</SelectPrimitive.ScrollUpButton>
