<script lang="ts">
	import { RadioGroup } from 'bits-ui';
	import type { Palette } from '#lib/themes.ts';
	import { Check as CheckIcon } from '@material-symbols-svg/svelte/rounded/icons/check';

	let {
		value,
		name,
		family,
		palette,
		selected,
		onpreview
	}: {
		value: string;
		name: string;
		family?: string;
		palette: Palette;
		selected: boolean;
		onpreview: () => void;
	} = $props();

	const p = $derived(palette);
</script>

<!-- A miniature of the app in this theme: drawer, page title, a card and buttons. -->
<RadioGroup.Item
	{value}
	class="state-layer flex flex-col gap-2 rounded-xl p-1.5 text-left transition-[border-radius,background-color] duration-300 ease-spring-gentle focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--md-secondary) active:rounded-2xl data-[state=checked]:bg-secondary-container data-[state=checked]:text-on-secondary-container"
	onmouseenter={onpreview}
	onfocus={onpreview}
>
	<span
		class="relative flex aspect-[16/10] w-full overflow-hidden rounded-lg"
		style:background={p.bg}
		style:box-shadow="inset 0 0 0 1px {p.border}"
		aria-hidden="true"
	>
		<span class="flex w-[30%] flex-col gap-[3px] p-2" style:background={p.sidebar}>
			<span class="h-[5px] w-full rounded-full" style:background={p.primary}></span>
			<span class="h-[3px] w-3/5 rounded-full opacity-70" style:background={p.subtle}></span>
			<span class="h-[3px] w-2/3 rounded-full opacity-70" style:background={p.subtle}></span>
		</span>
		<span class="flex flex-1 flex-col gap-[5px] p-2">
			<span class="h-1 w-1/2 rounded-full" style:background={p.text}></span>
			<span class="flex flex-1 flex-col gap-[3px] rounded-[5px] p-1.5" style:background={p.card}>
				<span class="h-[3px] w-3/4 rounded-full opacity-80" style:background={p.subtle}></span>
				<span class="h-[3px] w-1/2 rounded-full opacity-50" style:background={p.subtle}></span>
				<span class="mt-auto flex items-center gap-1">
					<span class="h-[7px] w-5 rounded-full" style:background={p.primary}></span>
					<span class="h-[7px] w-3 rounded-full" style:background={p.raised}></span>
				</span>
			</span>
		</span>
		{#if selected}
			<span
				class="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full"
				style:background={p.primary}
				style:color={p.onPrimary}><CheckIcon class="size-4" /></span
			>
		{/if}
	</span>
	<span class="flex min-w-0 flex-col px-1 pb-0.5">
		<span class="truncate text-label-lg">{name}</span>
		<span class="truncate text-body-sm opacity-80">{family ?? ' '}</span>
	</span>
</RadioGroup.Item>
