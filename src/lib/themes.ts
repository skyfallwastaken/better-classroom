import {
	argbFromHex,
	Blend,
	DynamicScheme,
	Hct,
	hexFromArgb,
	MaterialDynamicColors as MDC,
	SchemeContent,
	SchemeExpressive,
	SchemeTonalSpot,
	SchemeVibrant,
	TonalPalette
} from '@material/material-color-utilities';
import { COLOR_NAMES, type ColorName } from '#lib/shared/colors.ts';

export type Mode = 'light' | 'dark';

/** Seed colours offered in Settings, in the spirit of Android's wallpaper palettes. */
export const SEEDS = [
	{ name: 'Classroom blue', hex: '#0b57d0' },
	{ name: 'Teal', hex: '#00897b' },
	{ name: 'Green', hex: '#188038' },
	{ name: 'Lime', hex: '#7c9a1c' },
	{ name: 'Amber', hex: '#e8a317' },
	{ name: 'Orange', hex: '#e8710a' },
	{ name: 'Red', hex: '#d93025' },
	{ name: 'Pink', hex: '#d01884' },
	{ name: 'Purple', hex: '#9334e6' },
	{ name: 'Indigo', hex: '#4355b9' }
] as const;

export const VARIANTS = [
	{ id: 'content', name: 'Faithful', description: 'Keeps your colour as it is' },
	{ id: 'tonal-spot', name: 'Tonal', description: 'Calm, low-chroma tones' },
	{ id: 'vibrant', name: 'Vibrant', description: 'Punchy, saturated surfaces' },
	{ id: 'expressive', name: 'Expressive', description: 'Playful clashing accents' }
] as const;

export type Variant = (typeof VARIANTS)[number]['id'];

/** A theme's look in one mode, as the colours a preview card needs. */
export type Palette = {
	bg: string;
	card: string;
	sidebar: string;
	raised: string;
	border: string;
	text: string;
	subtle: string;
	primary: string;
	onPrimary: string;
	destructive: string;
};

export type Preset = { id: string; name: string; family: string; mode: Mode; palette: Palette };

/** Hand-tuned editor themes, carried over from before Material You. */
export const PRESETS = [
	{
		id: 'catppuccin-latte',
		name: 'Latte',
		family: 'Catppuccin',
		mode: 'light',
		palette: {
			bg: '#eff1f5',
			card: '#eff1f5',
			sidebar: '#e6e9ef',
			raised: '#ccd0da',
			border: '#bcc0cc',
			text: '#4c4f69',
			subtle: '#6c6f85',
			primary: '#8839ef',
			onPrimary: '#eff1f5',
			destructive: '#d20f39'
		}
	},
	{
		id: 'catppuccin-frappe',
		name: 'Frappé',
		family: 'Catppuccin',
		mode: 'dark',
		palette: {
			bg: '#303446',
			card: '#292c3c',
			sidebar: '#292c3c',
			raised: '#414559',
			border: '#51576d',
			text: '#c6d0f5',
			subtle: '#a5adce',
			primary: '#ca9ee6',
			onPrimary: '#303446',
			destructive: '#e78284'
		}
	},
	{
		id: 'catppuccin-macchiato',
		name: 'Macchiato',
		family: 'Catppuccin',
		mode: 'dark',
		palette: {
			bg: '#24273a',
			card: '#1e2030',
			sidebar: '#1e2030',
			raised: '#363a4f',
			border: '#494d64',
			text: '#cad3f5',
			subtle: '#a5adcb',
			primary: '#c6a0f6',
			onPrimary: '#24273a',
			destructive: '#ed8796'
		}
	},
	{
		id: 'catppuccin-mocha',
		name: 'Mocha',
		family: 'Catppuccin',
		mode: 'dark',
		palette: {
			bg: '#1e1e2e',
			card: '#181825',
			sidebar: '#181825',
			raised: '#313244',
			border: '#45475a',
			text: '#cdd6f4',
			subtle: '#a6adc8',
			primary: '#cba6f7',
			onPrimary: '#1e1e2e',
			destructive: '#f38ba8'
		}
	},
	{
		id: 'ayu-light',
		name: 'Light',
		family: 'Ayu',
		mode: 'light',
		palette: {
			bg: '#fcfcfc',
			card: '#ffffff',
			sidebar: '#f8f9fa',
			raised: '#f3f4f5',
			border: '#e5e7ea',
			text: '#5c6166',
			subtle: '#8a9199',
			primary: '#ffaa33',
			onPrimary: '#242936',
			destructive: '#e65050'
		}
	},
	{
		id: 'ayu-mirage',
		name: 'Mirage',
		family: 'Ayu',
		mode: 'dark',
		palette: {
			bg: '#1f2430',
			card: '#1c212b',
			sidebar: '#242936',
			raised: '#2f3542',
			border: '#373e4c',
			text: '#cccac2',
			subtle: '#8a94a6',
			primary: '#ffcc66',
			onPrimary: '#1f2430',
			destructive: '#f28779'
		}
	},
	{
		id: 'ayu-dark',
		name: 'Dark',
		family: 'Ayu',
		mode: 'dark',
		palette: {
			bg: '#0b0e14',
			card: '#0f131a',
			sidebar: '#0d1017',
			raised: '#1a1f28',
			border: '#232935',
			text: '#bfbdb6',
			subtle: '#8a9199',
			primary: '#e6b450',
			onPrimary: '#0b0e14',
			destructive: '#f07178'
		}
	},
	{
		id: 'rose-pine-dawn',
		name: 'Dawn',
		family: 'Rosé Pine',
		mode: 'light',
		palette: {
			bg: '#faf4ed',
			card: '#fffaf3',
			sidebar: '#fffaf3',
			raised: '#f2e9e1',
			border: '#dfdad9',
			text: '#575279',
			subtle: '#797593',
			primary: '#286983',
			onPrimary: '#faf4ed',
			destructive: '#b4637a'
		}
	},
	{
		id: 'rose-pine-moon',
		name: 'Moon',
		family: 'Rosé Pine',
		mode: 'dark',
		palette: {
			bg: '#232136',
			card: '#2a273f',
			sidebar: '#2a273f',
			raised: '#393552',
			border: '#44415a',
			text: '#e0def4',
			subtle: '#908caa',
			primary: '#c4a7e7',
			onPrimary: '#232136',
			destructive: '#eb6f92'
		}
	},
	{
		id: 'rose-pine',
		name: 'Rosé Pine',
		family: 'Rosé Pine',
		mode: 'dark',
		palette: {
			bg: '#191724',
			card: '#1f1d2e',
			sidebar: '#1f1d2e',
			raised: '#26233a',
			border: '#403d52',
			text: '#e0def4',
			subtle: '#908caa',
			primary: '#c4a7e7',
			onPrimary: '#191724',
			destructive: '#eb6f92'
		}
	},
	{
		id: 'tokyo-night',
		name: 'Tokyo Night',
		family: 'Tokyo Night',
		mode: 'dark',
		palette: {
			bg: '#1a1b26',
			card: '#16161e',
			sidebar: '#16161e',
			raised: '#292e42',
			border: '#3b4261',
			text: '#c0caf5',
			subtle: '#737aa2',
			primary: '#7aa2f7',
			onPrimary: '#1a1b26',
			destructive: '#f7768e'
		}
	},
	{
		id: 'nord',
		name: 'Nord',
		family: 'Nord',
		mode: 'dark',
		palette: {
			bg: '#2e3440',
			card: '#3b4252',
			sidebar: '#3b4252',
			raised: '#434c5e',
			border: '#4c566a',
			text: '#eceff4',
			subtle: '#a5adbe',
			primary: '#88c0d0',
			onPrimary: '#2e3440',
			destructive: '#bf616a'
		}
	},
	{
		id: 'gruvbox-light',
		name: 'Light',
		family: 'Gruvbox',
		mode: 'light',
		palette: {
			bg: '#fbf1c7',
			card: '#f9f5d7',
			sidebar: '#f2e5bc',
			raised: '#ebdbb2',
			border: '#d5c4a1',
			text: '#3c3836',
			subtle: '#7c6f64',
			primary: '#af3a03',
			onPrimary: '#fbf1c7',
			destructive: '#9d0006'
		}
	},
	{
		id: 'gruvbox-dark',
		name: 'Dark',
		family: 'Gruvbox',
		mode: 'dark',
		palette: {
			bg: '#282828',
			card: '#32302f',
			sidebar: '#1d2021',
			raised: '#3c3836',
			border: '#504945',
			text: '#ebdbb2',
			subtle: '#a89984',
			primary: '#fabd2f',
			onPrimary: '#282828',
			destructive: '#fb4934'
		}
	}
] as const satisfies readonly Preset[];

export type PresetId = (typeof PRESETS)[number]['id'];

/** Each mode either follows Material You (seed + style) or uses a preset. */
export type ModeTheme = 'material' | PresetId;

const PRESET_BY_ID: ReadonlyMap<string, Preset> = new Map(PRESETS.map((p) => [p.id, p]));

export function presetFor(mode: Mode, value: unknown): Preset | undefined {
	const preset = typeof value === 'string' ? PRESET_BY_ID.get(value) : undefined;
	return preset?.mode === mode ? preset : undefined;
}

export type Colors = { seed: string; variant: Variant };

export type ThemeChoice = Colors & { light: ModeTheme; dark: ModeTheme };

export const DEFAULT_THEME: ThemeChoice = {
	seed: SEEDS[0].hex,
	variant: 'content',
	light: 'material',
	dark: 'material'
};

export function isVariant(value: unknown): value is Variant {
	return VARIANTS.some((v) => v.id === value);
}

export function isHex(value: unknown): value is string {
	return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);
}

const SCHEMES = {
	content: SchemeContent,
	'tonal-spot': SchemeTonalSpot,
	vibrant: SchemeVibrant,
	expressive: SchemeExpressive
} satisfies Record<Variant, unknown>;

const ROLES = {
	primary: MDC.primary,
	'on-primary': MDC.onPrimary,
	'primary-container': MDC.primaryContainer,
	'on-primary-container': MDC.onPrimaryContainer,
	'inverse-primary': MDC.inversePrimary,
	secondary: MDC.secondary,
	'on-secondary': MDC.onSecondary,
	'secondary-container': MDC.secondaryContainer,
	'on-secondary-container': MDC.onSecondaryContainer,
	tertiary: MDC.tertiary,
	'on-tertiary': MDC.onTertiary,
	'tertiary-container': MDC.tertiaryContainer,
	'on-tertiary-container': MDC.onTertiaryContainer,
	error: MDC.error,
	'on-error': MDC.onError,
	'error-container': MDC.errorContainer,
	'on-error-container': MDC.onErrorContainer,
	surface: MDC.surface,
	'surface-dim': MDC.surfaceDim,
	'surface-bright': MDC.surfaceBright,
	'surface-container-lowest': MDC.surfaceContainerLowest,
	'surface-container-low': MDC.surfaceContainerLow,
	'surface-container': MDC.surfaceContainer,
	'surface-container-high': MDC.surfaceContainerHigh,
	'surface-container-highest': MDC.surfaceContainerHighest,
	'on-surface': MDC.onSurface,
	'on-surface-variant': MDC.onSurfaceVariant,
	'inverse-surface': MDC.inverseSurface,
	'inverse-on-surface': MDC.inverseOnSurface,
	outline: MDC.outline,
	'outline-variant': MDC.outlineVariant,
	scrim: MDC.scrim,
	shadow: MDC.shadow
};

/** Fixed brand-ish colours that M3 calls "custom colours": harmonised toward the seed. */
const CUSTOM = { success: '#188038', warning: '#e37400' };

/** Identity colours for courses: kept recognisable, so they are not harmonised. */
const COURSE: Record<ColorName, string> = {
	emerald: '#10b981',
	amber: '#f59e0b',
	sky: '#0ea5e9',
	rose: '#f43f5e',
	violet: '#8b5cf6',
	teal: '#14b8a6',
	orange: '#f97316',
	fuchsia: '#d946ef',
	lime: '#84cc16',
	cyan: '#06b6d4'
};

function tonalRoles(name: string, argb: number, dark: boolean): [string, string][] {
	const p = TonalPalette.fromInt(argb);
	const t = dark ? [80, 20, 30, 90] : [40, 100, 90, 10];
	return [
		[name, p.tone(t[0])],
		[`on-${name}`, p.tone(t[1])],
		[`${name}-container`, p.tone(t[2])],
		[`on-${name}-container`, p.tone(t[3])]
	].map(([k, v]) => [k as string, hexFromArgb(v as number)]);
}

function scheme(choice: Colors, dark: boolean): DynamicScheme {
	// '2025' is the Material 3 Expressive colour spec.
	return new SCHEMES[choice.variant](Hct.fromInt(argbFromHex(choice.seed)), dark, 0, '2025');
}

function roles(choice: Colors, dark: boolean): Map<string, string> {
	const source = argbFromHex(choice.seed);
	const s = scheme(choice, dark);
	const entries: [string, string][] = Object.entries(ROLES).map(([k, c]) => [
		k,
		hexFromArgb(c.getArgb(s))
	]);
	for (const [name, hex] of Object.entries(CUSTOM))
		entries.push(...tonalRoles(name, Blend.harmonize(argbFromHex(hex), source), dark));
	for (const name of COLOR_NAMES)
		entries.push(...tonalRoles(`course-${name}`, argbFromHex(COURSE[name]), dark));
	return new Map(entries);
}

function mix(a: string, b: string, t: number): string {
	const [x, y] = [argbFromHex(a), argbFromHex(b)];
	const ch = (v: number, shift: number) => (v >> shift) & 255;
	const c = (shift: number) => Math.round(ch(x, shift) + (ch(y, shift) - ch(x, shift)) * t);
	return `#${[16, 8, 0].map((sh) => c(sh).toString(16).padStart(2, '0')).join('')}`;
}

/** M3 outlines (field borders) need 3:1 against the surface; walk from the border toward the subtle text until they get it. */
function outlineFor(p: Palette): string {
	for (let t = 0.5; t < 1; t += 0.05) {
		const c = mix(p.border, p.subtle, t);
		if (contrast(c, p.bg) >= 3) return c;
	}
	return p.subtle;
}

function contrast(a: string, b: string): number {
	const lum = (hex: string) => Hct.fromInt(argbFromHex(hex)).tone;
	// Tone is L* (0-100); convert to relative luminance for the WCAG ratio.
	const y = (t: number) => (t > 8 ? ((t + 16) / 116) ** 3 : t / 903.3);
	const [x, z] = [y(lum(a)), y(lum(b))].sort((m, n) => n - m);
	return (x + 0.05) / (z + 0.05);
}

/**
 * A preset keeps its own surfaces, text, outlines and accent; everything else (tertiary,
 * error containers, course and status colours) comes from a scheme seeded by its accent.
 */
function presetRoles(preset: Preset): Map<string, string> {
	const p = preset.palette;
	const r = roles({ seed: p.primary, variant: 'content' }, preset.mode === 'dark');
	const own: Record<string, string> = {
		primary: p.primary,
		'on-primary': p.onPrimary,
		'primary-container': mix(p.bg, p.primary, 0.3),
		'on-primary-container': p.text,
		'secondary-container': mix(p.bg, p.primary, 0.18),
		'on-secondary-container': p.text,
		error: p.destructive,
		surface: p.bg,
		'surface-dim': p.bg,
		'surface-bright': p.bg,
		'surface-container-lowest': p.bg,
		'surface-container-low': mix(p.bg, p.raised, 0.45),
		'surface-container': p.sidebar === p.bg ? mix(p.bg, p.raised, 0.6) : p.sidebar,
		'surface-container-high': p.raised,
		'surface-container-highest': mix(p.raised, p.border, 0.5),
		'on-surface': p.text,
		'on-surface-variant': p.subtle,
		'inverse-surface': p.text,
		'inverse-on-surface': p.bg,
		outline: outlineFor(p),
		'outline-variant': p.border
	};
	for (const [k, v] of Object.entries(own)) r.set(k, v);
	return r;
}

function modeRoles(choice: ThemeChoice, mode: Mode): Map<string, string> {
	const preset = presetFor(mode, choice[mode]);
	return preset ? presetRoles(preset) : roles(choice, mode === 'dark');
}

function css(r: Map<string, string>): string {
	return [...r].map(([k, v]) => `--md-${k}:${v}`).join(';');
}

/** The colours a theme preview card draws, for Material You in the given mode. */
export function materialPalette(choice: Colors, mode: Mode): Palette {
	const r = roles(choice, mode === 'dark');
	const g = (k: string) => r.get(k)!;
	return {
		bg: g('surface'),
		card: g('surface-container-low'),
		sidebar: g('surface-container'),
		raised: g('surface-container-high'),
		border: g('outline-variant'),
		text: g('on-surface'),
		subtle: g('on-surface-variant'),
		primary: g('primary'),
		onPrimary: g('on-primary'),
		destructive: g('error')
	};
}

/** The three accent roles Android shows in a wallpaper-colour swatch. */
export function swatch(choice: Colors, dark: boolean): [string, string, string] {
	const s = scheme(choice, dark);
	return [MDC.primary, MDC.secondaryContainer, MDC.tertiary].map((c) =>
		hexFromArgb(c.getArgb(s))
	) as [string, string, string];
}

/**
 * CSS for both modes. `html:root` outranks the plain `:root` default that is
 * server-rendered, so a saved choice wins no matter which stylesheet loads last.
 */
export function themeCss(choice: ThemeChoice, root = 'html:root'): string {
	return `${root}{${css(modeRoles(choice, 'light'))}}\n${root}[data-mode='dark']{${css(modeRoles(choice, 'dark'))}}`;
}

/** CSS that shows one preset (or Material You for a mode) right now, for hover previews. */
export function previewCss(choice: ThemeChoice, mode: Mode, value: ModeTheme): string {
	return `html:root[data-mode][data-mode]{${css(modeRoles({ ...choice, [mode]: value }, mode))}}`;
}

/** `data-course-color="sky"` points the --course-* variables at that course's roles. */
const courseCss = COLOR_NAMES.map(
	(n) =>
		`[data-course-color='${n}']{${['', 'on-']
			.flatMap((on) => [
				`--${on}course:var(--md-${on}course-${n})`,
				`--${on}course-container:var(--md-${on}course-${n}-container)`
			])
			.join(';')}}`
).join('\n');

export const defaultThemeCss = `${themeCss(DEFAULT_THEME, ':root')}\n${courseCss}`;
