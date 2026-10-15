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

export type ThemeChoice = { seed: string; variant: Variant };

export const DEFAULT_THEME: ThemeChoice = { seed: SEEDS[0].hex, variant: 'content' };

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

function scheme(choice: ThemeChoice, dark: boolean): DynamicScheme {
	// '2025' is the Material 3 Expressive colour spec.
	return new SCHEMES[choice.variant](Hct.fromInt(argbFromHex(choice.seed)), dark, 0, '2025');
}

function vars(choice: ThemeChoice, dark: boolean): string {
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
	return entries.map(([k, v]) => `--md-${k}:${v}`).join(';');
}

/** The three accent roles Android shows in a wallpaper-colour swatch. */
export function swatch(choice: ThemeChoice, dark: boolean): [string, string, string] {
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
	return `${root}{${vars(choice, false)}}\n${root}[data-mode='dark']{${vars(choice, true)}}`;
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
