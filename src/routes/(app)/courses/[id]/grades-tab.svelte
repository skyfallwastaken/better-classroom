<script lang="ts">
	import { gradePercent, type WorkSummary } from '#lib/work.ts';
	import { formatDue } from '#lib/format.ts';
	import { pluralize } from '#lib/text.ts';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import { Percent as PercentIcon } from '@material-symbols-svg/svelte/rounded/icons/percent';

	let { work, courseId }: { work: WorkSummary[]; courseId: string } = $props();

	const graded = $derived(
		work
			.filter((w) => w.assignedGrade !== undefined)
			.sort((a, b) => (b.dueAt ?? b.updatedAt) - (a.dueAt ?? a.updatedAt))
	);
	const totals = $derived.by(() => {
		const scored = graded.filter((w) => w.maxPoints);
		const earned = scored.reduce((n, w) => n + (w.assignedGrade ?? 0), 0);
		const possible = scored.reduce((n, w) => n + (w.maxPoints ?? 0), 0);
		return { earned, possible, percent: possible ? Math.round((earned / possible) * 100) : null };
	});
</script>

{#if graded.length === 0}
	<Empty.Root class="bg-surface-container-low">
		<Empty.Header>
			<Empty.Media variant="icon"><PercentIcon /></Empty.Media>
			<Empty.Title>Nothing graded yet</Empty.Title>
			<Empty.Description>Returned work with a grade will be listed here.</Empty.Description>
		</Empty.Header>
	</Empty.Root>
{:else}
	<div class="flex flex-wrap items-baseline justify-between gap-2">
		<h2 class="text-title-lg text-on-surface">
			{pluralize(graded.length, 'graded assignment')}
		</h2>
		{#if totals.percent !== null}
			<p class="text-body-md text-on-surface-variant tabular-nums">
				Overall <span class="text-title-sm text-on-surface">{totals.percent}%</span>
				· {totals.earned}/{totals.possible} points
			</p>
		{/if}
	</div>
	<ul role="list" class="mt-4 segmented">
		{#each graded as w (w.id)}
			{@const pct = gradePercent(w)}
			<li>
				<a
					href={`/courses/${courseId}/work/${w.id}`}
					class="state-layer flex min-h-18 items-center gap-3 rounded-[inherit] px-4 py-2.5 text-on-surface"
				>
					<div class="min-w-0 flex-1">
						<p class="truncate text-body-lg">{w.title}</p>
						<p class="text-body-md text-on-surface-variant tabular-nums">
							{w.dueAt !== undefined ? formatDue(w.dueAt, w.hasDueTime) : 'No due date'}{#if w.late}
								· late{/if}
						</p>
					</div>
					<div class="w-24 shrink-0 text-right text-body-md tabular-nums">
						<span class="text-title-sm text-on-surface">{w.assignedGrade}</span
						>{#if w.maxPoints}<span class="text-on-surface-variant">/{w.maxPoints}</span>{/if}
					</div>
					{#if pct !== null}
						<div class="w-16 shrink-0 text-right text-body-md text-on-surface-variant tabular-nums">
							{Math.round(pct)}%
						</div>
					{/if}
				</a>
			</li>
		{/each}
	</ul>
{/if}
