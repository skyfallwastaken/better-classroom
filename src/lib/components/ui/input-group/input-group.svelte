<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...props
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="input-group"
	role="group"
	class={cn(
		'group/input-group relative flex h-14 w-full min-w-0 items-center rounded-xs border border-outline text-on-surface transition-[border-color,box-shadow] duration-150 ease-standard outline-none hover:border-on-surface in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:shadow-none has-disabled:pointer-events-none has-disabled:border-on-surface/12 has-disabled:text-on-surface/38 has-[[data-slot=input-group-control]:focus-visible]:border-primary has-[[data-slot=input-group-control]:focus-visible]:shadow-[inset_0_0_0_1px_var(--md-primary)] has-[[data-slot][aria-invalid=true]]:border-error has-[[data-slot][aria-invalid=true]]:hover:border-on-error-container has-[[data-slot][aria-invalid=true]]:has-[[data-slot=input-group-control]:focus-visible]:border-error has-[[data-slot][aria-invalid=true]]:has-[[data-slot=input-group-control]:focus-visible]:shadow-[inset_0_0_0_1px_var(--md-error)] has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-4 has-[>[data-align=inline-start]]:[&>input]:pl-4',
		className
	)}
	{...props}
>
	{@render children?.()}
</div>
