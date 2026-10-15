import { browser } from '$app/env';
import {
	DEFAULT_THEME,
	isHex,
	isVariant,
	themeCss,
	type Mode,
	type ThemeChoice
} from '#lib/themes.ts';

export type ModePref = Mode | 'system';

const KEY_MODE = 'theme.mode';
const KEY_SEED = 'theme.seed';
const KEY_VARIANT = 'theme.variant';
/** The generated CSS, read by the inline script in app.html before first paint. */
const KEY_CSS = 'theme.css';
const STYLE_ID = 'theme-custom';

export const theme = $state<ThemeChoice & { mode: ModePref; resolved: Mode }>({
	mode: 'system',
	...DEFAULT_THEME,
	resolved: 'light'
});

function systemMode(): Mode {
	return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function isDefault() {
	return theme.seed === DEFAULT_THEME.seed && theme.variant === DEFAULT_THEME.variant;
}

function paintColors(): string {
	let style = document.getElementById(STYLE_ID);
	const css = isDefault() ? '' : themeCss({ seed: theme.seed, variant: theme.variant });
	if (!style) {
		style = document.createElement('style');
		style.id = STYLE_ID;
		document.head.append(style);
	}
	style.textContent = css;
	return css;
}

function applyMode() {
	theme.resolved = theme.mode === 'system' ? systemMode() : theme.mode;
	document.documentElement.dataset.mode = theme.resolved;
}

function persist(css?: string) {
	try {
		localStorage.setItem(KEY_MODE, theme.mode);
		localStorage.setItem(KEY_SEED, theme.seed);
		localStorage.setItem(KEY_VARIANT, theme.variant);
		if (css !== undefined) localStorage.setItem(KEY_CSS, css);
	} catch {}
}

export function setMode(mode: ModePref) {
	theme.mode = mode;
	applyMode();
	persist();
}

export function setColors(choice: Partial<ThemeChoice>) {
	if (choice.seed && isHex(choice.seed)) theme.seed = choice.seed.toLowerCase();
	if (choice.variant && isVariant(choice.variant)) theme.variant = choice.variant;
	persist(paintColors());
}

if (browser) {
	try {
		const mode = localStorage.getItem(KEY_MODE);
		const seed = localStorage.getItem(KEY_SEED);
		const variant = localStorage.getItem(KEY_VARIANT);
		if (mode === 'light' || mode === 'dark' || mode === 'system') theme.mode = mode;
		if (isHex(seed)) theme.seed = seed;
		if (isVariant(variant)) theme.variant = variant;
	} catch {}
	applyMode();
	// Regenerate in case the colour engine changed since the CSS was cached.
	persist(paintColors());
	matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
		if (theme.mode === 'system') applyMode();
	});
}
