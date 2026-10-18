<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import { cn } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: DialogPrimitive.OverlayProps = $props();
</script>

<DialogPrimitive.Overlay
	bind:ref
	data-slot="dialog-overlay"
	class={cn(
		'fixed inset-0 isolate z-50 bg-scrim/32 data-open:animate-in data-open:duration-500 data-open:ease-standard data-open:fade-in-0 data-closed:animate-out data-closed:duration-150 data-closed:ease-standard data-closed:fade-out-0',
		className
	)}
	{...restProps}
/>
