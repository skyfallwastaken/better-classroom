<script lang="ts">
	import { MoreHoriz as MoreHorizIcon } from '@material-symbols-svg/svelte/rounded/icons/more-horiz';
	import { cn, type WithElementRef, type WithoutChildren } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildren<WithElementRef<HTMLAttributes<HTMLSpanElement>>> = $props();
</script>

<span
	bind:this={ref}
	data-slot="breadcrumb-ellipsis"
	role="presentation"
	aria-hidden="true"
	class={cn(
		'flex size-10 items-center justify-center text-on-surface-variant [&>svg]:size-5',
		className
	)}
	{...restProps}
>
	<MoreHorizIcon />
	<span class="sr-only">More</span>
</span>
