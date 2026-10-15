import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';
import { createTV } from 'tailwind-variants';

// The M3 type scale (text-display-lg … text-label-sm) is a set of font sizes. Without this,
// tailwind-merge reads them as colours and drops whichever of size or colour comes first.
const twMergeConfig = {
	extend: {
		theme: {
			text: ['display', 'headline', 'title', 'body', 'label'].flatMap((role) =>
				['lg', 'md', 'sm'].map((size) => `${role}-${size}`)
			)
		}
	}
};
const twMerge = extendTailwindMerge(twMergeConfig);
export const tv = createTV({ twMergeConfig });

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
