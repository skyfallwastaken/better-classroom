<script lang="ts">
	import { Separator } from '#lib/components/ui/separator/index.js';
	import { cn } from '#lib/utils.js';
	import type { Separator as SeparatorPrimitive } from 'bits-ui';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: SeparatorPrimitive.RootProps = $props();
</script>

<Separator
	bind:ref
	data-slot="select-separator"
	class={cn('pointer-events-none mx-2 my-0 h-px shrink-0 bg-outline-variant', className)}
	{...restProps}
/>
