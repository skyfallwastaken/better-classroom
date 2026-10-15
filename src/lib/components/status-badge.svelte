<script lang="ts">
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { isDueSoon } from '#lib/format.ts';
	import { statusLabel, type WorkSummary } from '#lib/work.ts';

	let {
		work
	}: { work: Pick<WorkSummary, 'status' | 'late' | 'dueAt' | 'assignedGrade' | 'maxPoints'> } =
		$props();
	const effective = $derived(
		work.status === 'assigned' && work.dueAt !== undefined && work.dueAt < Date.now()
			? 'missing'
			: work.status
	);
</script>

{#if effective === 'graded' && work.assignedGrade !== undefined}
	<Badge variant="secondary" class="tabular-nums">
		{work.assignedGrade}{#if work.maxPoints}<span class="opacity-70">/{work.maxPoints}</span>{/if}
	</Badge>
{:else if effective === 'missing'}
	<Badge variant="destructive">Missing</Badge>
{:else if effective === 'turnedIn' || effective === 'returned'}
	<Badge class="bg-success-container text-on-success-container">
		{statusLabel[effective]}{#if work.late}<span class="opacity-70">· late</span>{/if}
	</Badge>
{:else if isDueSoon(work.dueAt)}
	<Badge class="bg-warning-container text-on-warning-container">Due soon</Badge>
{/if}
