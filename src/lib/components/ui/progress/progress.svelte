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

	const indeterminate = $derived(value === null);
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
	{#if indeterminate}
		<!-- Indeterminate (value={null}): a primary bar sweeps across the track. -->
		<div class="relative h-full flex-1 overflow-hidden rounded-full bg-secondary-container">
			<div
				data-slot="progress-indicator"
				class="absolute inset-y-0 w-2/5 animate-[md-progress-indeterminate_1.6s_cubic-bezier(0.65,0,0.35,1)_infinite] rounded-full bg-primary"
			></div>
		</div>
	{:else}
		<!-- The indicator's width includes the 4px gap so the fill lands exactly on the percentage. -->
		<div
			data-slot="progress-indicator"
			class="h-full shrink-0 rounded-full bg-primary transition-[width] duration-500 ease-emphasized"
			style:width={percent > 0 && percent < 100 ? `calc(${percent}% - 4px)` : `${percent}%`}
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
	{/if}
</ProgressPrimitive.Root>
