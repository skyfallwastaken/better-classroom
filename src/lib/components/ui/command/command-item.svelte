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
		"group/command-item relative flex min-h-12 cursor-default items-center gap-3 rounded-md px-3 py-2 text-body-lg text-on-surface outline-hidden transition-[background-color] duration-150 ease-standard select-none data-selected:bg-on-surface/10 data-[disabled=true]:pointer-events-none data-[disabled=true]:text-on-surface/38 [&_svg]:pointer-events-none [&_svg]:shrink-0 data-[disabled=true]:[&_svg]:text-on-surface/38 [&_svg:not([class*='size-'])]:size-6 [&_svg:not([class*='text-'])]:text-on-surface-variant",
		className
	)}
	{...restProps}
>
	{@render children?.()}
	<CheckIcon
		class="cn-command-item-indicator ml-auto size-5 text-on-surface-variant opacity-0 group-has-[[data-slot=command-shortcut]]/command-item:hidden group-data-[checked=true]/command-item:opacity-100"
	/>
</CommandPrimitive.Item>
