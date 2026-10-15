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
	style="--normal-bg: var(--md-inverse-surface); --normal-text: var(--md-inverse-on-surface); --normal-border: transparent; --border-radius: 12px;"
	{...restProps}
>
	{#snippet loadingIcon()}
		<ProgressActivityIcon class="size-4 animate-spin" />
	{/snippet}
	{#snippet successIcon()}
		<CheckCircleIcon class="size-4" />
	{/snippet}
	{#snippet errorIcon()}
		<DangerousIcon class="size-4" />
	{/snippet}
	{#snippet infoIcon()}
		<InfoIcon class="size-4" />
	{/snippet}
	{#snippet warningIcon()}
		<WarningIcon class="size-4" />
	{/snippet}
</Sonner>
