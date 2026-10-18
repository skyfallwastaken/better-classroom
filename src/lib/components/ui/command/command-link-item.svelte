<script lang="ts">
	import { Command as CommandPrimitive } from 'bits-ui';
	import { cn } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: CommandPrimitive.LinkItemProps = $props();
</script>

<CommandPrimitive.LinkItem
	bind:ref
	data-slot="command-item"
	class={cn(
		"relative flex min-h-12 cursor-default items-center gap-3 rounded-md px-3 py-2 text-body-lg text-on-surface outline-hidden transition-[background-color] duration-150 ease-standard select-none aria-selected:bg-on-surface/10 data-[disabled=true]:pointer-events-none data-[disabled=true]:text-on-surface/38 [&_svg]:pointer-events-none [&_svg]:shrink-0 data-[disabled=true]:[&_svg]:text-on-surface/38 [&_svg:not([class*='size-'])]:size-6 [&_svg:not([class*='text-'])]:text-on-surface-variant",
		className
	)}
	{...restProps}
/>
