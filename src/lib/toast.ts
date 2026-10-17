import { toast } from 'svelte-sonner';

export type Tone = 'sky' | 'amber' | 'emerald' | 'rose' | 'violet' | 'pink';

// Neutral tones use the M3 snackbar (inverse surface); outcomes use tonal containers.
const SNACKBAR = '!bg-inverse-surface !text-inverse-on-surface !border-transparent';
const tones: Record<Tone, string> = {
	sky: SNACKBAR,
	violet: SNACKBAR,
	pink: SNACKBAR,
	amber: '!bg-warning-container !text-on-warning-container !border-transparent',
	emerald: '!bg-success-container !text-on-success-container !border-transparent',
	rose: '!bg-error-container !text-on-error-container !border-transparent'
};

export function notify(
	tone: Tone,
	message: string,
	options: {
		description?: string;
		action?: { label: string; onClick: () => void | Promise<void> };
		duration?: number;
	} = {}
) {
	return toast(message, {
		description: options.description,
		duration: options.duration ?? 5000,
		class: tones[tone],
		descriptionClass: '!text-inherit opacity-80',
		// M3 snackbar actions are inverse-primary text buttons; tonal toasts keep their content colour.
		actionButtonStyle: `background: transparent; color: ${tones[tone] === SNACKBAR ? 'var(--md-inverse-primary)' : 'inherit'}; font-weight: 500;`,
		action: options.action
			? { label: options.action.label, onClick: () => void options.action!.onClick() }
			: undefined
	});
}
