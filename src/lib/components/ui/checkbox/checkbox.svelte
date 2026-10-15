<script lang="ts">
	import { Checkbox as CheckboxPrimitive } from 'bits-ui';
	import { Check as CheckIcon } from '@material-symbols-svg/svelte/rounded/icons/check';
	import { Remove as RemoveIcon } from '@material-symbols-svg/svelte/rounded/icons/remove';
	import { cn, type WithoutChildrenOrChild } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		checked = $bindable(false),
		indeterminate = $bindable(false),
		class: className,
		...restProps
	}: WithoutChildrenOrChild<CheckboxPrimitive.RootProps> = $props();
</script>

<CheckboxPrimitive.Root
	bind:ref
	data-slot="checkbox"
	class={cn(
		'peer relative flex size-[18px] shrink-0 items-center justify-center rounded-[2px] border-2 border-on-surface-variant transition-colors duration-150 outline-none group-has-disabled/field:opacity-50 group-has-[:focus-visible]/field-label:ring-0 group-has-[:focus-visible]/field-label:not-data-checked:border-input after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-on-primary dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-on-primary group-has-[:focus-visible]/field-label:data-checked:border-primary dark:data-checked:bg-primary',
		className
	)}
	bind:checked
	bind:indeterminate
	{...restProps}
>
	{#snippet children({ checked, indeterminate })}
		<div
			data-slot="checkbox-indicator"
			class="grid place-content-center text-current transition-none [&>svg]:size-4"
		>
			{#if checked}
				<CheckIcon />
			{:else if indeterminate}
				<RemoveIcon />
			{/if}
		</div>
	{/snippet}
</CheckboxPrimitive.Root>
