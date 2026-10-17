<script lang="ts">
	import { theme, setMode, setColors } from '#lib/theme.svelte.ts';
	import { SEEDS, VARIANTS, swatch } from '#lib/themes.ts';
	import * as ToggleGroup from '#lib/components/ui/toggle-group/index.js';
	import { RadioGroup } from 'bits-ui';
	import { BrightnessAuto as BrightnessAutoIcon } from '@material-symbols-svg/svelte/rounded/icons/brightness-auto';
	import { LightMode as LightModeIcon } from '@material-symbols-svg/svelte/rounded/icons/light-mode';
	import { DarkMode as DarkModeIcon } from '@material-symbols-svg/svelte/rounded/icons/dark-mode';
	import { Check as CheckIcon } from '@material-symbols-svg/svelte/rounded/icons/check';
	import { Colorize as ColorizeIcon } from '@material-symbols-svg/svelte/rounded/icons/colorize';
	import SettingsCard from './settings-card.svelte';

	const dark = $derived(theme.resolved === 'dark');
	const custom = $derived(!SEEDS.some((s) => s.hex === theme.seed));
</script>

{#snippet dot(seed: string, selected: boolean)}
	{@const [a, b, c] = swatch({ seed, variant: theme.variant }, dark)}
	<!-- Android-style wallpaper swatch: primary on top, secondary and tertiary below. -->
	<span
		class="relative grid size-full grid-cols-2 grid-rows-2 overflow-hidden rounded-[inherit]"
		aria-hidden="true"
	>
		<span class="col-span-2" style:background={a}></span>
		<span style:background={b}></span>
		<span style:background={c}></span>
		{#if selected}
			<span
				class="absolute inset-0 m-auto flex size-7 items-center justify-center rounded-full bg-primary-container text-on-primary-container"
				><CheckIcon class="size-5" /></span
			>
		{/if}
	</span>
{/snippet}

<SettingsCard class="max-w-3xl">
	<div class="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
		<div>
			<h2 class="text-title-lg">Mode</h2>
			<p class="mt-1 text-body-md text-on-surface-variant">
				System follows your device's light or dark setting.
			</p>
		</div>
		<ToggleGroup.Root
			type="single"
			variant="outline"
			value={theme.mode}
			onValueChange={(v) => v && setMode(v as typeof theme.mode)}
		>
			<ToggleGroup.Item value="system" aria-label="System"
				><BrightnessAutoIcon data-icon="inline-start" />System</ToggleGroup.Item
			>
			<ToggleGroup.Item value="light" aria-label="Light"
				><LightModeIcon data-icon="inline-start" />Light</ToggleGroup.Item
			>
			<ToggleGroup.Item value="dark" aria-label="Dark"
				><DarkModeIcon data-icon="inline-start" />Dark</ToggleGroup.Item
			>
		</ToggleGroup.Root>
	</div>

	<div class="border-t px-6 py-5">
		<h2 class="text-title-lg">Colour</h2>
		<p class="mt-1 text-body-md text-on-surface-variant">
			Material You builds every surface, button and accent from the colour you pick.
		</p>
		<!-- Arrow keys move between presets (roving focus); the custom picker sits beside the group. -->
		<div class="mt-4 flex flex-wrap gap-2">
			<RadioGroup.Root
				aria-label="Theme colour"
				orientation="horizontal"
				class="flex flex-wrap gap-2"
				value={custom ? '' : theme.seed}
				onValueChange={(v) => v && setColors({ seed: v })}
			>
				{#each SEEDS as seed (seed.hex)}
					{@const selected = theme.seed === seed.hex}
					<RadioGroup.Item
						value={seed.hex}
						aria-label={seed.name}
						title={seed.name}
						class="size-14 rounded-full outline-offset-2 outline-primary transition-[border-radius,transform] duration-500 ease-spring hover:scale-105 focus-visible:outline-2 active:scale-95 data-[state=checked]:rounded-xl"
					>
						{@render dot(seed.hex, selected)}
					</RadioGroup.Item>
				{/each}
			</RadioGroup.Root>
			<label
				class="relative size-14 cursor-pointer overflow-hidden rounded-full outline-offset-2 outline-primary transition-[border-radius,transform] duration-500 ease-spring hover:scale-105 has-focus-visible:outline-2 {custom
					? 'rounded-xl'
					: 'bg-surface-container-highest'}"
				title="Custom colour"
			>
				{#if custom}
					{@render dot(theme.seed, true)}
				{:else}
					<span class="flex size-full items-center justify-center text-on-surface-variant"
						><ColorizeIcon class="size-6" /></span
					>
				{/if}
				<input
					type="color"
					class="absolute inset-0 cursor-pointer opacity-0"
					aria-label={custom ? 'Custom colour (in use)' : 'Custom colour'}
					value={theme.seed}
					onchange={(e) => setColors({ seed: e.currentTarget.value })}
				/>
			</label>
		</div>
	</div>

	<div class="border-t px-6 py-5">
		<h2 class="text-title-lg">Style</h2>
		<p class="mt-1 text-body-md text-on-surface-variant">
			How the colour is spread across the palette.
		</p>
		<RadioGroup.Root
			aria-label="Colour style"
			class="mt-4 grid gap-2 sm:grid-cols-2"
			value={theme.variant}
			onValueChange={(v) => v && setColors({ variant: v as typeof theme.variant })}
		>
			{#each VARIANTS as v (v.id)}
				{@const selected = theme.variant === v.id}
				{@const [a, b, c] = swatch({ seed: theme.seed, variant: v.id }, dark)}
				<RadioGroup.Item
					value={v.id}
					class="state-layer flex items-center gap-4 rounded-xl bg-surface-container px-4 py-3 text-left transition-[border-radius,background-color] duration-300 ease-spring-gentle focus-visible:outline-2 focus-visible:outline-primary active:rounded-2xl data-[state=checked]:bg-secondary-container data-[state=checked]:text-on-secondary-container"
				>
					<span class="flex shrink-0 -space-x-2" aria-hidden="true">
						{#each [a, b, c] as color, i (i)}
							<span
								class="size-6 rounded-full ring-2 ring-surface-container-low"
								style:background={color}
							></span>
						{/each}
					</span>
					<span class="min-w-0 flex-1">
						<span class="block text-title-sm">{v.name}</span>
						<span class="block text-body-sm opacity-80">{v.description}</span>
					</span>
					{#if selected}<CheckIcon class="size-5 shrink-0" />{/if}
				</RadioGroup.Item>
			{/each}
		</RadioGroup.Root>
	</div>
	<p class="border-t px-6 py-3 text-body-sm text-on-surface-variant">
		Saved for this browser only.
	</p>
</SettingsCard>
