<script lang="ts">
	import { cn, type WithElementRef, type WithoutChildren } from '#lib/utils.js';
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		'data-slot': dataSlot = 'textarea',
		...restProps
	}: WithoutChildren<WithElementRef<HTMLTextareaAttributes>> = $props();
</script>

<textarea
	bind:this={ref}
	data-slot={dataSlot}
	class={cn(
		'flex field-sizing-content min-h-16 w-full rounded-xs border border-outline bg-transparent px-3.5 py-3 text-base transition-[border-color,box-shadow] outline-none placeholder:text-on-surface-variant hover:border-on-surface focus-visible:border-primary focus-visible:shadow-[inset_0_0_0_1px_var(--md-primary)] disabled:cursor-not-allowed disabled:opacity-[0.38] aria-invalid:border-error aria-invalid:shadow-[inset_0_0_0_1px_var(--md-error)] md:text-sm',
		className
	)}
	bind:value
	{...restProps}></textarea>
