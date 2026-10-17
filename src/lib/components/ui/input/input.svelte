<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';

	type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

	type Props = WithElementRef<
		Omit<HTMLInputAttributes, 'type'> &
			({ type: 'file'; files?: FileList } | { type?: InputType; files?: undefined })
	>;

	let {
		ref = $bindable(null),
		value = $bindable(),
		type,
		files = $bindable(),
		class: className,
		'data-slot': dataSlot = 'input',
		...restProps
	}: Props = $props();
</script>

{#if type === 'file'}
	<input
		bind:this={ref}
		data-slot={dataSlot}
		class={cn(
			'h-14 w-full min-w-0 rounded-xs border border-outline bg-transparent px-4 py-4 text-body-lg text-on-surface caret-primary transition-[border-color,box-shadow] duration-150 ease-standard outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-label-lg file:text-on-surface placeholder:text-on-surface-variant hover:border-on-surface focus-visible:border-primary focus-visible:shadow-[inset_0_0_0_1px_var(--md-primary)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-on-surface/12 disabled:text-on-surface/38 disabled:placeholder:text-on-surface/38 aria-invalid:border-error aria-invalid:caret-error aria-invalid:hover:border-on-error-container aria-invalid:focus-visible:border-error aria-invalid:focus-visible:shadow-[inset_0_0_0_1px_var(--md-error)]',
			className
		)}
		type="file"
		bind:files
		bind:value
		{...restProps}
	/>
{:else}
	<input
		bind:this={ref}
		data-slot={dataSlot}
		class={cn(
			'h-14 w-full min-w-0 rounded-xs border border-outline bg-transparent px-4 py-4 text-body-lg text-on-surface caret-primary transition-[border-color,box-shadow] duration-150 ease-standard outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-label-lg file:text-on-surface placeholder:text-on-surface-variant hover:border-on-surface focus-visible:border-primary focus-visible:shadow-[inset_0_0_0_1px_var(--md-primary)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-on-surface/12 disabled:text-on-surface/38 disabled:placeholder:text-on-surface/38 aria-invalid:border-error aria-invalid:caret-error aria-invalid:hover:border-on-error-container aria-invalid:focus-visible:border-error aria-invalid:focus-visible:shadow-[inset_0_0_0_1px_var(--md-error)]',
			className
		)}
		{type}
		bind:value
		{...restProps}
	/>
{/if}
