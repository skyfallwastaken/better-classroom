<script lang="ts">
	import { Command as CommandPrimitive } from 'bits-ui';
	import * as InputGroup from '#lib/components/ui/input-group/index.js';
	import { Search as SearchIcon } from '@material-symbols-svg/svelte/rounded/icons/search';
	import { cn } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		value = $bindable(''),
		...restProps
	}: CommandPrimitive.InputProps = $props();
</script>

<!-- M3 docked search view header: 56dp, leading search icon, body-large input, outline divider -->
<div data-slot="command-input-wrapper" class="shrink-0 border-b border-outline">
	<InputGroup.Root
		class="h-14 rounded-none border-0 bg-transparent shadow-none! hover:border-0 *:data-[slot=input-group-addon]:pl-5 has-[>[data-align=inline-start]]:[&>input]:pl-3"
	>
		<CommandPrimitive.Input
			{value}
			data-slot="command-input"
			class={cn(
				'h-14 w-full text-body-lg text-on-surface caret-primary outline-hidden placeholder:text-on-surface-variant disabled:cursor-not-allowed',
				className
			)}
			{...restProps}
		>
			{#snippet child({ props })}
				<InputGroup.Input {...props} bind:value bind:ref />
			{/snippet}
		</CommandPrimitive.Input>
		<InputGroup.Addon>
			<SearchIcon
				class="size-6 shrink-0 text-on-surface group-has-[:disabled]/input-group:text-on-surface/38"
			/>
		</InputGroup.Addon>
	</InputGroup.Root>
</div>
