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

<!--
M3 checkbox (Compose CheckboxTokens, m3e CheckboxElement): an 18px box with 2px corners and a
2px on-surface-variant outline (on-surface on hover/press) that fills with primary and an 18px
on-primary mark when selected. A 40px circular state layer (on-surface unselected, primary
selected; 8% hover, 10% focus/press) and the 3px secondary focus ring sit around it without
affecting layout. Disabled: outline / container on-surface 38%, mark in surface.
-->
<CheckboxPrimitive.Root
	bind:ref
	data-slot="checkbox"
	class={cn(
		'peer relative isolate flex size-[18px] shrink-0 items-center justify-center rounded-[2px] border-2 border-on-surface-variant outline-none select-none [transition:border-color_200ms_var(--ease-standard),background-color_200ms_var(--ease-standard),color_200ms_var(--ease-standard)] enabled:data-[state=unchecked]:hover:border-on-surface enabled:data-[state=unchecked]:active:border-on-surface',
		// State layer + focus ring: a 40px circle centred on the box (-13px around its 14px padding box).
		'[--sl-c:var(--md-on-surface)] [--sl-o:0%] before:pointer-events-none before:absolute before:-inset-[13px] before:-z-10 before:rounded-full before:bg-[color-mix(in_srgb,var(--sl-c)_var(--sl-o),transparent)] before:outline-offset-2 before:outline-(color:--md-secondary) before:transition-[background-color] before:duration-150 before:ease-standard hover:[--sl-o:8%] focus-visible:[--sl-o:10%] focus-visible:before:animate-focus-ring focus-visible:before:outline-3 focus-visible:before:outline-solid active:[--sl-o:10%] data-[state=indeterminate]:[--sl-c:var(--md-primary)] data-checked:[--sl-c:var(--md-primary)]',
		// Larger hit target.
		'after:absolute after:-inset-x-3 after:-inset-y-2',
		'data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-on-primary data-checked:border-primary data-checked:bg-primary data-checked:text-on-primary',
		'aria-invalid:border-error aria-invalid:[--sl-c:var(--md-error)] aria-invalid:data-checked:border-error aria-invalid:data-checked:bg-error aria-invalid:data-checked:text-on-error',
		'disabled:cursor-not-allowed disabled:border-on-surface/38 disabled:before:hidden disabled:data-[state=indeterminate]:border-transparent disabled:data-[state=indeterminate]:bg-on-surface/38 disabled:data-[state=indeterminate]:text-surface disabled:data-checked:border-transparent disabled:data-checked:bg-on-surface/38 disabled:data-checked:text-surface',
		className
	)}
	bind:checked
	bind:indeterminate
	{...restProps}
>
	{#snippet children({ checked, indeterminate })}
		<div
			data-slot="checkbox-indicator"
			class="pointer-events-none absolute -inset-[2px] grid place-content-center text-current [&>svg]:size-[18px]"
		>
			{#if indeterminate}
				<RemoveIcon />
			{:else if checked}
				<CheckIcon class="animate-checkbox-draw" />
			{/if}
		</div>
	{/snippet}
</CheckboxPrimitive.Root>
