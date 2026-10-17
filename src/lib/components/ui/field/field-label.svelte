<script lang="ts">
	import { Label } from '#lib/components/ui/label/index.js';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: ComponentProps<typeof Label> = $props();
</script>

<Label
	bind:ref
	data-slot="field-label"
	class={cn(
		'group/field-label peer/field-label flex w-fit gap-2 transition-colors duration-150 ease-standard group-has-[input:focus-visible,textarea:focus-visible,[data-slot=select-trigger]:focus-visible]/field:text-primary group-data-[disabled=true]/field:opacity-38 group-data-[invalid=true]/field:text-error has-data-checked:border-primary has-data-checked:bg-secondary-container has-data-checked:text-on-secondary-container has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border has-[>[data-slot=field]]:border-outline-variant has-[>[data-slot=field]]:not-has-[:disabled,[data-disabled]]:hover:bg-on-surface/8 has-[>[data-slot=field]]:has-[:focus-visible]:outline-3 has-[>[data-slot=field]]:has-[:focus-visible]:outline-(color:--md-secondary) *:data-[slot=field]:p-3',
		'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</Label>
