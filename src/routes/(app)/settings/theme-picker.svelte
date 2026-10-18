<script lang="ts">
	import {
		theme,
		setMode,
		setColors,
		setModeTheme,
		previewModeTheme,
		endPreview
	} from '#lib/theme.svelte.ts';
	import {
		PRESETS,
		SEEDS,
		VARIANTS,
		materialPalette,
		swatch,
		type Mode,
		type ModeTheme
	} from '#lib/themes.ts';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import ThemeCard from './theme-card.svelte';
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
	/** Colour and Style only drive the modes that use Material You. */
	const materialActive = $derived(theme[theme.resolved] === 'material');

	// Hovering or focusing a card tries it on; leaving the group (briefly debounced so moving
	// between cards doesn't flicker) puts the saved theme back.
	let previewTimer: ReturnType<typeof setTimeout> | undefined;
	function preview(mode: Mode, value: ModeTheme) {
		clearTimeout(previewTimer);
		previewModeTheme(mode, value);
	}
	function leaveGroup() {
		clearTimeout(previewTimer);
		previewTimer = setTimeout(endPreview, 150);
	}
	function focusOutGroup(e: FocusEvent) {
		const group = e.currentTarget as HTMLElement;
		if (!group.contains(e.relatedTarget as Node | null)) leaveGroup();
	}
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

<SettingsCard>
	<div class="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
		<div>
			<h2 class="text-title-md">Mode</h2>
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

	{#each ['light', 'dark'] as const as mode (mode)}
		{@const active = theme.resolved === mode}
		<div class="border-t border-outline-variant px-5 py-4">
			<div class="flex items-center gap-2">
				<h2 class="text-title-md">{mode === 'light' ? 'Light theme' : 'Dark theme'}</h2>
				{#if active}<Badge variant="secondary">In use</Badge>{/if}
			</div>
			<RadioGroup.Root
				aria-label={mode === 'light' ? 'Light theme' : 'Dark theme'}
				orientation="horizontal"
				class="mt-3 grid grid-cols-[repeat(auto-fill,minmax(8.5rem,1fr))] gap-2"
				value={theme[mode]}
				onValueChange={(v) => v && setModeTheme(mode, v as ModeTheme)}
				onmouseleave={leaveGroup}
				onfocusout={focusOutGroup}
			>
				<ThemeCard
					value="material"
					name="Material You"
					family="Your colour"
					palette={materialPalette(theme, mode)}
					selected={theme[mode] === 'material'}
					onpreview={() => preview(mode, 'material')}
				/>
				{#each PRESETS.filter((p) => p.mode === mode) as preset (preset.id)}
					<ThemeCard
						value={preset.id}
						name={preset.name}
						family={preset.family === preset.name ? undefined : preset.family}
						palette={preset.palette}
						selected={theme[mode] === preset.id}
						onpreview={() => preview(mode, preset.id)}
					/>
				{/each}
			</RadioGroup.Root>
		</div>
	{/each}

	<div
		class="border-t border-outline-variant px-5 py-4 transition-opacity {materialActive
			? ''
			: 'opacity-60 hover:opacity-100'}"
	>
		<h2 class="text-title-md">Colour</h2>
		<p class="mt-1 text-body-md text-on-surface-variant">
			{materialActive
				? 'Material You builds every surface, button and accent from the colour you pick.'
				: `Your ${theme.resolved} theme is a preset. Colour and Style apply to Material You themes.`}
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

	<div
		class="border-t border-outline-variant px-5 py-4 transition-opacity {materialActive
			? ''
			: 'opacity-60 hover:opacity-100'}"
	>
		<h2 class="text-title-md">Style</h2>
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
	<p class="border-t border-outline-variant px-5 py-3 text-body-sm text-on-surface-variant">
		Hover a theme to try it on. Saved for this browser only.
	</p>
</SettingsCard>
