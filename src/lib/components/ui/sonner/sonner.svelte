<script lang="ts">
	import { Toaster as Sonner, type ToasterProps as SonnerProps } from 'svelte-sonner';
	import { ProgressActivity as ProgressActivityIcon } from '@material-symbols-svg/svelte/rounded/icons/progress-activity';
	import { CheckCircle as CheckCircleIcon } from '@material-symbols-svg/svelte/rounded/icons/check-circle';
	import { Dangerous as DangerousIcon } from '@material-symbols-svg/svelte/rounded/icons/dangerous';
	import { Info as InfoIcon } from '@material-symbols-svg/svelte/rounded/icons/info';
	import { Warning as WarningIcon } from '@material-symbols-svg/svelte/rounded/icons/warning';

	let { ...restProps }: SonnerProps = $props();
</script>

<Sonner
	theme="system"
	class="toaster group font-sans!"
	style="--normal-bg: var(--md-inverse-surface); --normal-text: var(--md-inverse-on-surface); --normal-border: transparent; --border-radius: 4px;"
	toastOptions={{
		// M3 snackbar (SnackbarTokens): 48dp single line, 4dp corners, body-medium, level 3.
		classes: {
			toast:
				'!min-h-12 !gap-3 !border-0 !py-1 !ps-4 !pe-2 !font-sans !text-body-md !shadow-[0_3px_5px_-1px_rgb(0_0_0/0.2),0_6px_10px_0_rgb(0_0_0/0.14),0_1px_18px_0_rgb(0_0_0/0.12)]',
			content: '!py-2.5',
			title: '!font-normal !text-body-md',
			description: '!text-body-md',
			icon: '!size-5 [&>svg]:!size-5',
			actionButton:
				'!h-10 !rounded-full !px-3 !text-label-lg !no-underline hover:!bg-current/8 focus-visible:!bg-current/10',
			cancelButton: '!h-10 !rounded-full !bg-transparent !px-3 !text-label-lg !text-current',
			closeButton:
				'!static !order-last !size-10 !shrink-0 !transform-none !rounded-full !border-0 !bg-transparent !text-current hover:!bg-current/8 [&>svg]:!size-6'
		}
	}}
	{...restProps}
>
	{#snippet loadingIcon()}
		<ProgressActivityIcon class="size-5 animate-spin" />
	{/snippet}
	{#snippet successIcon()}
		<CheckCircleIcon class="size-5" />
	{/snippet}
	{#snippet errorIcon()}
		<DangerousIcon class="size-5" />
	{/snippet}
	{#snippet infoIcon()}
		<InfoIcon class="size-5" />
	{/snippet}
	{#snippet warningIcon()}
		<WarningIcon class="size-5" />
	{/snippet}
</Sonner>
