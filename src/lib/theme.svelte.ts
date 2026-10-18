import { browser } from '$app/env';
import {
	DEFAULT_THEME,
	isHex,
	isVariant,
	presetFor,
	previewCss,
	themeCss,
	type Colors,
	type Mode,
	type ModeTheme,
	type ThemeChoice
} from '#lib/themes.ts';

export type ModePref = Mode | 'system';

const KEY_MODE = 'theme.mode';
const KEY_SEED = 'theme.seed';
const KEY_VARIANT = 'theme.variant';
/** Same keys the preset picker used before Material You, so saved presets carry over. */
const KEY_THEME: Record<Mode, string> = { light: 'theme.light', dark: 'theme.dark' };
/** The generated CSS, read by the inline script in app.html before first paint. */
const KEY_CSS = 'theme.css';
const STYLE_ID = 'theme-custom';
const PREVIEW_ID = 'theme-preview';

export const theme = $state<ThemeChoice & { mode: ModePref; resolved: Mode }>({
	mode: 'system',
	...DEFAULT_THEME,
	resolved: 'light'
});

function systemMode(): Mode {
	return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function choice(): ThemeChoice {
	return { seed: theme.seed, variant: theme.variant, light: theme.light, dark: theme.dark };
}

function isDefault() {
	return (Object.keys(DEFAULT_THEME) as (keyof ThemeChoice)[]).every(
		(k) => theme[k] === DEFAULT_THEME[k]
	);
}

function styleTag(id: string) {
	let style = document.getElementById(id);
	if (!style) {
		style = document.createElement('style');
		style.id = id;
		document.head.append(style);
	}
	return style;
}

function paintColors(): string {
	const css = isDefault() ? '' : themeCss(choice());
	styleTag(STYLE_ID).textContent = css;
	return css;
}

let previewing: Mode | null = null;

function applyMode() {
	theme.resolved = theme.mode === 'system' ? systemMode() : theme.mode;
	document.documentElement.dataset.mode = previewing ?? theme.resolved;
}

function persist(css?: string) {
	try {
		localStorage.setItem(KEY_MODE, theme.mode);
		localStorage.setItem(KEY_SEED, theme.seed);
		localStorage.setItem(KEY_VARIANT, theme.variant);
		localStorage.setItem(KEY_THEME.light, theme.light);
		localStorage.setItem(KEY_THEME.dark, theme.dark);
		if (css !== undefined) localStorage.setItem(KEY_CSS, css);
	} catch {}
}

export function setMode(mode: ModePref) {
	theme.mode = mode;
	applyMode();
	persist();
}

export function setColors(colors: Partial<Colors>) {
	if (colors.seed && isHex(colors.seed)) theme.seed = colors.seed.toLowerCase();
	if (colors.variant && isVariant(colors.variant)) theme.variant = colors.variant;
	persist(paintColors());
}

/** Use Material You or a preset for one mode. */
export function setModeTheme(mode: Mode, value: ModeTheme) {
	if (value !== 'material' && !presetFor(mode, value)) return;
	theme[mode] = value;
	endPreview();
	persist(paintColors());
}

/** Show a theme on the whole app while it is hovered or focused in the picker. */
export function previewModeTheme(mode: Mode, value: ModeTheme) {
	previewing = mode;
	styleTag(PREVIEW_ID).textContent = previewCss(choice(), mode, value);
	applyMode();
}

export function endPreview() {
	previewing = null;
	document.getElementById(PREVIEW_ID)?.remove();
	applyMode();
}

if (browser) {
	try {
		const mode = localStorage.getItem(KEY_MODE);
		const seed = localStorage.getItem(KEY_SEED);
		const variant = localStorage.getItem(KEY_VARIANT);
		if (mode === 'light' || mode === 'dark' || mode === 'system') theme.mode = mode;
		if (isHex(seed)) theme.seed = seed;
		if (isVariant(variant)) theme.variant = variant;
		for (const m of ['light', 'dark'] as const) {
			const preset = presetFor(m, localStorage.getItem(KEY_THEME[m]));
			if (preset) theme[m] = preset.id as ModeTheme;
		}
	} catch {}
	applyMode();
	// Regenerate in case the colour engine changed since the CSS was cached.
	persist(paintColors());
	matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
		if (theme.mode === 'system') applyMode();
	});
}
