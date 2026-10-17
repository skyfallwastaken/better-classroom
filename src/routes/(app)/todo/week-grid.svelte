<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import StatusBadge from '#lib/components/status-badge.svelte';
	import WorkItem from '#lib/components/work-item.svelte';
	import CourseDot from '#lib/components/course-dot.svelte';
	import { dueDayStart, formatDate, formatTime, startOfDay } from '#lib/format.ts';
	import type { WorkSummary } from '#lib/work.ts';
	import { ChevronLeft as ChevronLeftIcon } from '@material-symbols-svg/svelte/rounded/icons/chevron-left';
	import { ChevronRight as ChevronRightIcon } from '@material-symbols-svg/svelte/rounded/icons/chevron-right';

	let { rows }: { rows: WorkSummary[] } = $props();

	const DAY = 86_400_000;
	const now = Date.now();
	const today = startOfDay(now);
	const mondayOf = (t: number) => {
		const d = new Date(t);
		const shift = (d.getDay() + 6) % 7;
		return startOfDay(t - shift * DAY);
	};
	let weekOffset = $state(0);
	const weekStart = $derived(mondayOf(today + weekOffset * 7 * DAY));
	const weekEnd = $derived(weekStart + 7 * DAY);
	const days = $derived(Array.from({ length: 7 }, (_, i) => weekStart + i * DAY));
	const dayFmt = new Intl.DateTimeFormat('en-GB', { weekday: 'short' });
	const numFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric' });
	const rangeFmt = { format: (t: number) => formatDate(t, { day: 'numeric', month: 'short' }) };
	const week = $derived.by(() => {
		const byDay = new Map<number, WorkSummary[]>();
		const overdue: WorkSummary[] = [];
		const undated: WorkSummary[] = [];
		for (const w of rows) {
			if (w.dueAt === undefined) {
				undated.push(w);
				continue;
			}
			const day = dueDayStart(w.dueAt, w.hasDueTime);
			if (day >= weekStart && day < weekEnd) byDay.set(day, [...(byDay.get(day) ?? []), w]);
			else if (w.status === 'missing' && day < weekStart) overdue.push(w);
		}
		return { byDay, overdue, undated };
	});
	const weekLabel = $derived(
		weekOffset === 0
			? 'This week'
			: weekOffset === 1
				? 'Next week'
				: weekOffset === -1
					? 'Last week'
					: `${rangeFmt.format(weekStart)} – ${rangeFmt.format(weekEnd - DAY)}`
	);
</script>

<div class="mt-6 flex flex-wrap items-center justify-between gap-2">
	<h2 class="text-title-lg text-on-surface">{weekLabel}</h2>
	<div class="flex items-center gap-1">
		<Button variant="ghost" size="icon" aria-label="Previous week" onclick={() => weekOffset--}
			><ChevronLeftIcon /></Button
		>
		<Button variant="outline" disabled={weekOffset === 0} onclick={() => (weekOffset = 0)}
			>Today</Button
		>
		<Button variant="ghost" size="icon" aria-label="Next week" onclick={() => weekOffset++}
			><ChevronRightIcon /></Button
		>
	</div>
</div>
{#if week.overdue.length}
	<section class="mt-4 rounded-2xl bg-error-container/60 px-4 py-3">
		<h3 class="text-title-sm text-on-error-container">Overdue from before this week</h3>
		<div class="mt-2 segmented">
			{#each week.overdue as w (w.id)}<WorkItem work={w} />{/each}
		</div>
	</section>
{/if}
<div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-7 lg:gap-2">
	{#each days as day (day)}
		{@const items = week.byDay.get(day) ?? []}
		{@const isToday = day === today}
		{@const past = day < today}
		<section
			class={`min-w-0 rounded-xl p-2 ${isToday ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-low'} ${past ? 'opacity-60' : ''}`}
		>
			<h3 class="flex items-baseline justify-between text-body-md">
				<span class={isToday ? 'text-title-sm' : 'text-title-sm text-on-surface-variant'}
					>{dayFmt.format(day)}</span
				>
				<span class="text-body-sm text-on-surface-variant tabular-nums">{numFmt.format(day)}</span>
			</h3>
			{#if items.length >= 3}
				<Badge variant="secondary" class="mt-1">Heavy · {items.length} due</Badge>
			{/if}
			<ul role="list" class="mt-2 flex flex-col gap-1.5">
				{#each items as w (w.id)}
					<li>
						<a
							href={`/courses/${w.courseId}/work/${w.id}`}
							class="state-layer block rounded-md bg-surface-container-highest px-2 py-1.5 text-body-sm text-on-surface transition-[border-radius] duration-300 ease-spring-gentle hover:rounded-lg"
						>
							<span class="flex items-center gap-1.5">
								<CourseDot id={w.courseId} class="shrink-0" />
								<span class="truncate text-on-surface-variant">{w.courseName}</span>
							</span>
							<span class="mt-0.5 line-clamp-2 font-medium">{w.title}</span>
							<span class="mt-1 flex flex-wrap items-center gap-1">
								{#if w.hasDueTime && w.dueAt}<span class="text-on-surface-variant tabular-nums"
										>{formatTime(w.dueAt)}</span
									>{/if}
								<StatusBadge work={w} />
							</span>
						</a>
					</li>
				{:else}
					<li class="py-2 text-center text-body-sm text-on-surface-variant">–</li>
				{/each}
			</ul>
		</section>
	{/each}
</div>
{#if week.undated.length}
	<section class="mt-6">
		<h3 class="px-4 text-title-sm text-on-surface-variant">No due date</h3>
		<div class="mt-2 segmented">
			{#each week.undated as w (w.id)}<WorkItem work={w} />{/each}
		</div>
	</section>
{/if}
