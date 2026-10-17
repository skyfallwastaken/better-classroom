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
		'flex field-sizing-content min-h-14 w-full rounded-xs border border-outline bg-transparent px-4 py-4 text-body-lg text-on-surface caret-primary transition-[border-color,box-shadow] duration-150 ease-standard outline-none placeholder:text-on-surface-variant hover:border-on-surface focus-visible:border-primary focus-visible:shadow-[inset_0_0_0_1px_var(--md-primary)] disabled:cursor-not-allowed disabled:border-on-surface/12 disabled:text-on-surface/38 disabled:placeholder:text-on-surface/38 aria-invalid:border-error aria-invalid:caret-error aria-invalid:hover:border-on-error-container aria-invalid:focus-visible:border-error aria-invalid:focus-visible:shadow-[inset_0_0_0_1px_var(--md-error)]',
		className
	)}
	bind:value
	{...restProps}></textarea>
