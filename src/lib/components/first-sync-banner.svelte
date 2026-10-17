<script lang="ts">
	import { live } from '#lib/db/live.svelte.ts';
	import { Button } from '#lib/components/ui/button/index.js';
	import { ProgressActivity as ProgressActivityIcon } from '@material-symbols-svg/svelte/rounded/icons/progress-activity';
	import { Warning as WarningIcon } from '@material-symbols-svg/svelte/rounded/icons/warning';
	import { Sync as SyncIcon } from '@material-symbols-svg/svelte/rounded/icons/sync';

	const sync = $derived(live.sync);
	const unsynced = $derived(sync !== null && !sync.syncedAt);
	const running = $derived(sync?.status === 'running');
	const failed = $derived(sync?.status === 'error');
	const progress = $derived.by(() => {
		if (!sync || !running || sync.courseCount === 0) return null;
		const done = Math.max(0, sync.courseCount - sync.pending);
		return `${done} of ${sync.courseCount} courses`;
	});

	let starting = $state(false);
	async function syncNow() {
		starting = true;
		try {
			await fetch('/api/sync', { method: 'POST' });
		} finally {
			starting = false;
		}
	}
</script>

{#if unsynced}
	<div
		role="status"
		class="flex flex-wrap items-center gap-x-3 gap-y-2 bg-warning-container px-4 py-2 text-label-lg text-on-warning-container"
	>
		{#if running}
			<ProgressActivityIcon class="size-4 shrink-0 animate-spin" />
			<span>
				Not synced yet. Your first sync is running{progress ? ` (${progress})` : ''}. Courses and
				work will appear as they load.
			</span>
		{:else if failed}
			<WarningIcon class="size-4 shrink-0" />
			<span class="min-w-0 flex-1">
				Not synced yet. The first sync failed{sync?.error ? `: ${sync.error.split('\n')[0]}` : '.'}
			</span>
			<Button
				size="sm"
				variant="outline"
				class="border-on-warning-container/40 text-on-warning-container"
				disabled={starting}
				onclick={syncNow}
			>
				<SyncIcon data-icon="inline-start" class={starting ? 'animate-spin' : ''} />
				Retry
			</Button>
		{:else}
			<WarningIcon class="size-4 shrink-0" />
			<span class="min-w-0 flex-1">
				Not synced yet. Nothing from Classroom has been pulled in for this account.
			</span>
			<Button
				size="sm"
				variant="outline"
				class="border-on-warning-container/40 text-on-warning-container"
				disabled={starting}
				onclick={syncNow}
			>
				<SyncIcon data-icon="inline-start" class={starting ? 'animate-spin' : ''} />
				Sync now
			</Button>
		{/if}
	</div>
{/if}
