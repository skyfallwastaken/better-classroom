<script lang="ts">
	import { ContextMenu as ContextMenuPrimitive } from 'bits-ui';
	import { cn } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: ContextMenuPrimitive.SubContentProps = $props();
</script>

<ContextMenuPrimitive.SubContent
	bind:ref
	data-slot="context-menu-sub-content"
	class={cn(
		'z-50 flex min-w-28 flex-col gap-0.5 overflow-x-hidden overflow-y-auto rounded-lg bg-surface-container-high p-1 text-on-surface shadow-[0_3px_3px_-2px_rgb(0_0_0/0.2),0_3px_4px_0_rgb(0_0_0/0.14),0_1px_8px_0_rgb(0_0_0/0.12)] outline-none data-[side=bottom]:origin-top data-[side=left]:origin-right data-[side=right]:origin-left data-[side=top]:origin-bottom motion-reduce:animate-none dark:ring-1 dark:ring-outline-variant data-open:animate-[md-menu-enter_350ms_cubic-bezier(0.27,1.06,0.18,1)] data-closed:animate-[md-menu-exit_100ms_cubic-bezier(0.2,0,0,1)_forwards]',
		className
	)}
	{...restProps}
/>
