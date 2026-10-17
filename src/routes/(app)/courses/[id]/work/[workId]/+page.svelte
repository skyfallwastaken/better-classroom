<script lang="ts">
	import { page } from '$app/state';
	import { useLiveQuery, eq } from '@tanstack/svelte-db';
	import { courses, courseWork, submissions } from '#lib/db/collections.ts';
	import { topicById } from '#lib/db/queries.ts';
	import { gradePercent, statusLabel, summarize, type WorkSummary } from '#lib/work.ts';
	import { Progress } from '#lib/components/ui/progress/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import Attachments from '#lib/components/attachments.svelte';
	import RichText from '#lib/components/rich-text.svelte';
	import PostHeader from '#lib/components/post-header.svelte';
	import { formatDate, formatDateLong, formatRelative, formatTime } from '#lib/format.ts';
	import { displayName } from '#lib/course.ts';
	import { Assignment as AssignmentIcon } from '@material-symbols-svg/svelte/rounded/icons/assignment';
	import { Help as QuestionIcon } from '@material-symbols-svg/svelte/rounded/icons/help';
	import SubmissionFiles from './submission-files.svelte';
	import SubmissionActions from './submission-actions.svelte';
	import PrivateComments from './private-comments.svelte';

	const row = useLiveQuery({
		query: (q) =>
			q
				.from({ w: courseWork })
				.where(({ w }) => eq(w.id, page.params.workId))
				.innerJoin({ c: courses }, ({ w, c }) => eq(w.courseId, c.id))
				.leftJoin({ s: submissions }, ({ w, s }) => eq(w.id, s.courseWorkId))
				.findOne()
	});
	const topicQuery = useLiveQuery({ query: (q) => topicById(q, row.data?.w.topicId) });

	const w = $derived(
		row.data ? summarize(row.data.w, row.data.s ?? undefined, displayName(row.data.c)) : null
	);
	const sub = $derived(row.data?.s ?? null);
	const teacher = $derived(
		row.data?.w.author?.name ??
			row.data?.c.teachers.find((t) => t.userId === row.data?.w.creatorUserId)?.name ??
			row.data?.c.teachers[0]?.name
	);
	const due = $derived(
		!w || w.dueAt === undefined
			? null
			: w.hasDueTime
				? `${formatDate(w.dueAt)}, ${formatTime(w.dueAt)}`
				: formatDate(w.dueAt, { day: 'numeric', month: 'short' }, true)
	);

	/** The status Classroom shows at the top right of "Your work". */
	function workState(w: WorkSummary): { text: string; tone: string } {
		const late = w.late ? ' · late' : '';
		if (w.status === 'graded' && w.assignedGrade !== undefined)
			return {
				text: (w.maxPoints ? `${w.assignedGrade}/${w.maxPoints}` : String(w.assignedGrade)) + late,
				tone: 'text-primary'
			};
		if (w.status === 'missing') return { text: 'Missing', tone: 'text-error' };
		if (w.status === 'turnedIn' && w.late) return { text: 'Done late', tone: 'text-warning' };
		if (w.status === 'turnedIn' || w.status === 'returned')
			return { text: statusLabel[w.status] + late, tone: 'text-success' };
		return { text: 'Assigned', tone: 'text-on-surface-variant' };
	}
</script>

{#if w}
	<div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
		<article class="min-w-0">
			<PostHeader
				courseId={w.courseId}
				title={w.title}
				byline={[teacher, `${formatRelative(w.createdAt)}`].filter(Boolean).join(' • ')}
				alternateLink={w.alternateLink}
			>
				{#snippet icon()}
					{#if w.workType.endsWith('QUESTION')}<QuestionIcon />{:else}<AssignmentIcon />{/if}
				{/snippet}
				{#snippet meta()}
					<span>{w.maxPoints ? `${w.maxPoints} points` : 'Ungraded'}</span>
					{#if due}
						<span class="h-4 w-px bg-outline-variant" aria-hidden="true"></span>
						<span title={w.dueAt ? formatDateLong(w.dueAt, !w.hasDueTime) : undefined}
							>Due {due}</span
						>
					{/if}
					{#if topicQuery.data}
						<Badge variant="outline" class="ml-auto">{topicQuery.data.name}</Badge>
					{/if}
				{/snippet}
			</PostHeader>

			<div class="mt-6 sm:pl-16">
				{#if w.description}
					<RichText
						text={w.description}
						html={w.html}
						class="max-w-[70ch] text-body-lg text-pretty break-words text-on-surface"
					/>
				{:else}
					<p class="text-body-lg text-on-surface-variant">No instructions were given.</p>
				{/if}
				{#if w.materials.length}
					<div class="mt-6"><Attachments items={w.materials} /></div>
				{/if}
			</div>
		</article>

		<aside class="flex flex-col gap-4">
			<section class="rounded-2xl bg-surface-container p-5" aria-labelledby="your-work">
				<div class="flex items-baseline justify-between gap-2">
					<h2 id="your-work" class="text-title-lg text-on-surface">Your work</h2>
					{#if sub}
						{@const state = workState(w)}
						<span class="text-label-lg {state.tone}">{state.text}</span>
					{/if}
				</div>
				{#if sub}
					{#if w.assignedGrade !== undefined && w.maxPoints}
						<Progress value={gradePercent(w) ?? 0} class="mt-3 h-1.5" />
					{/if}
					<p class="mt-1 text-body-sm text-on-surface-variant">
						Updated {formatRelative(sub.updatedAt)}
					</p>
					<div class="mt-4"><SubmissionFiles work={w} fallback={sub.attachments} /></div>
					<SubmissionActions work={w} submission={sub} />
				{:else}
					<p class="mt-2 text-body-md text-on-surface-variant">No submission record yet.</p>
				{/if}
			</section>
			{#if sub}
				<section class="rounded-2xl bg-surface-container p-5">
					<PrivateComments work={w} {teacher} />
				</section>
			{/if}
		</aside>
	</div>
{/if}
