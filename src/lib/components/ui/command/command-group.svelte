<script lang="ts">
	import { Command as CommandPrimitive, useId } from 'bits-ui';
	import { cn } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		children,
		heading,
		value,
		...restProps
	}: CommandPrimitive.GroupProps & {
		heading?: string;
	} = $props();
</script>

<CommandPrimitive.Group
	bind:ref
	data-slot="command-group"
	class={cn('overflow-hidden pb-2 text-on-surface last:pb-0', className)}
	value={value ?? heading ?? `----${useId()}`}
	{...restProps}
>
	{#if heading}
		<CommandPrimitive.GroupHeading
			class="flex min-h-8 items-center px-3 text-label-lg text-on-surface-variant"
		>
			{heading}
		</CommandPrimitive.GroupHeading>
	{/if}
	<CommandPrimitive.GroupItems {children} />
</CommandPrimitive.Group>
