export const COLOR_NAMES = [
	'emerald',
	'amber',
	'sky',
	'rose',
	'violet',
	'teal',
	'orange',
	'fuchsia',
	'lime',
	'cyan'
] as const;

export type ColorName = (typeof COLOR_NAMES)[number];

export function hashedColor(id: string): ColorName {
	let h = 0;
	for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
	return COLOR_NAMES[h % COLOR_NAMES.length]!;
}
