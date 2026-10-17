<script lang="ts">
	import { Progress as ProgressPrimitive } from 'bits-ui';
	import { cn, type WithoutChildrenOrChild } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		max = 100,
		value,
		...restProps
	}: WithoutChildrenOrChild<ProgressPrimitive.RootProps> = $props();

	const percent = $derived(Math.min(100, Math.max(0, (100 * (value ?? 0)) / (max || 1))));
</script>

<!--
M3 Expressive linear progress (Compose LinearProgressIndicatorTokens / ProgressIndicatorTokens):
4px thick, a fully rounded primary indicator, a 4px gap, then the rounded secondary-container
track ending in a 4px primary stop dot (no trailing space). The gap only appears once there is
progress, and the track and stop disappear at 100%.
-->
<ProgressPrimitive.Root
	bind:ref
	data-slot="progress"
	class={cn('relative flex h-1 w-full items-center', className)}
	{value}
	{max}
	{...restProps}
>
	<div
		data-slot="progress-indicator"
		class="h-full shrink rounded-full bg-primary transition-[width] duration-500 ease-emphasized"
		style:width="{percent}%"
	></div>
	{#if percent < 100}
		<div
			class={[
				'relative h-full min-w-0 flex-1 rounded-full bg-secondary-container',
				percent > 0 && 'ml-1'
			]}
		>
			<div class="absolute inset-y-0 right-0 aspect-square rounded-full bg-primary"></div>
		</div>
	{/if}
</ProgressPrimitive.Root>
