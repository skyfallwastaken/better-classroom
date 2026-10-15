<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.js';
	import { pluralize } from '#lib/text.ts';
	import { DoneAll as DoneAllIcon } from '@material-symbols-svg/svelte/rounded/icons/done-all';
	import { Undo as UndoIcon } from '@material-symbols-svg/svelte/rounded/icons/undo';
	import { Close as CloseIcon } from '@material-symbols-svg/svelte/rounded/icons/close';

	let {
		count,
		turnInable,
		reclaimable,
		busy,
		onTurnIn,
		onReclaim,
		onClear
	}: {
		count: number;
		turnInable: number;
		reclaimable: number;
		busy: boolean;
		onTurnIn: () => void;
		onReclaim: () => void;
		onClear: () => void;
	} = $props();
</script>

<!-- M3 Expressive floating toolbar -->
<div
	class="fixed bottom-6 left-1/2 z-20 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 animate-in flex-wrap items-center gap-1 rounded-full bg-primary-container py-2 pr-2 pl-5 text-on-primary-container shadow-xl duration-300 ease-spring fade-in-0 slide-in-from-bottom-6 md:left-[calc(50%+var(--sidebar-width,0px)/2)]"
	role="toolbar"
	aria-label="Selection actions"
>
	<span class="mr-2 text-label-lg tabular-nums">{pluralize(count, 'assignment')} selected</span>
	<Button disabled={!turnInable || busy} onclick={onTurnIn}>
		<DoneAllIcon data-icon="inline-start" />Mark {turnInable === count
			? 'as done'
			: `${turnInable} as done`}
	</Button>
	<Button
		variant="ghost"
		class="text-on-primary-container"
		disabled={!reclaimable || busy}
		onclick={onReclaim}
	>
		<UndoIcon data-icon="inline-start" />Unsubmit{reclaimable !== count ? ` ${reclaimable}` : ''}
	</Button>
	<Button
		size="icon"
		variant="ghost"
		class="text-on-primary-container"
		onclick={onClear}
		aria-label="Clear selection"
	>
		<CloseIcon />
	</Button>
</div>
