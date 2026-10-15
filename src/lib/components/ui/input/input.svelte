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
			'h-11 w-full min-w-0 rounded-xs border border-outline bg-transparent px-3.5 py-1 text-base transition-[border-color,box-shadow] outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-on-surface-variant hover:border-on-surface focus-visible:border-primary focus-visible:shadow-[inset_0_0_0_1px_var(--md-primary)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-[0.38] aria-invalid:border-error aria-invalid:shadow-[inset_0_0_0_1px_var(--md-error)] md:text-sm',
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
			'h-11 w-full min-w-0 rounded-xs border border-outline bg-transparent px-3.5 py-1 text-base transition-[border-color,box-shadow] outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-on-surface-variant hover:border-on-surface focus-visible:border-primary focus-visible:shadow-[inset_0_0_0_1px_var(--md-primary)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-[0.38] aria-invalid:border-error aria-invalid:shadow-[inset_0_0_0_1px_var(--md-error)] md:text-sm',
			className
		)}
		{type}
		bind:value
		{...restProps}
	/>
{/if}
