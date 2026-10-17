<script lang="ts">
	import { Textarea } from '#lib/components/ui/textarea/index.js';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		...props
	}: ComponentProps<typeof Textarea> = $props();
</script>

<Textarea
	bind:ref
	data-slot="input-group-control"
	class={cn(
		'flex-1 resize-none rounded-none border-0 bg-transparent py-4 shadow-none ring-0 focus-visible:shadow-none focus-visible:ring-0 disabled:bg-transparent aria-invalid:shadow-none aria-invalid:focus-visible:shadow-none',
		className
	)}
	bind:value
	{...props}
/>
