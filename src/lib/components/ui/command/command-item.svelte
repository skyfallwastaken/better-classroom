<script lang="ts">
	import { Command as CommandPrimitive } from 'bits-ui';
	import { Check as CheckIcon } from '@material-symbols-svg/svelte/rounded/icons/check';
	import { cn } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: CommandPrimitive.ItemProps = $props();
</script>

<CommandPrimitive.Item
	bind:ref
	data-slot="command-item"
	class={cn(
		"group/command-item relative flex min-h-11 cursor-default items-center gap-2 rounded-full px-4 py-2 text-label-lg outline-hidden select-none data-selected:bg-secondary-container data-selected:text-on-secondary-container data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-selected:*:[svg]:text-on-secondary-container",
		className
	)}
	{...restProps}
>
	{@render children?.()}
	<CheckIcon
		class="cn-command-item-indicator ml-auto opacity-0 group-has-[[data-slot=command-shortcut]]/command-item:hidden group-data-[checked=true]/command-item:opacity-100"
	/>
</CommandPrimitive.Item>
