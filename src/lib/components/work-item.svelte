<script lang="ts">
	import * as Item from '#lib/components/ui/item/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import StatusBadge from '#lib/components/status-badge.svelte';
	import { formatDue } from '#lib/format.ts';
	import CourseAvatar from '#lib/components/course-avatar.svelte';
	import { isNew, type WorkSummary } from '#lib/work.ts';
	import { Assignment as AssignmentIcon } from '@material-symbols-svg/svelte/rounded/icons/assignment';
	import { Help as HelpIcon } from '@material-symbols-svg/svelte/rounded/icons/help';

	let { work, showCourse = true }: { work: WorkSummary; showCourse?: boolean } = $props();
	const isQuestion = $derived(work.workType.endsWith('QUESTION'));
</script>

<!-- M3 two-line list item (Compose ListTokens): 72px, 16px leading/trailing, 12px between, 40px avatar -->
<Item.Root variant="default" size="sm" class="state-layer min-h-18 [a]:hover:bg-transparent">
	{#snippet child({ props })}
		<a href={`/courses/${work.courseId}/work/${work.id}`} {...props}>
			<CourseAvatar id={work.courseId}>
				{#if isQuestion}<HelpIcon />{:else}<AssignmentIcon />{/if}
			</CourseAvatar>
			<Item.Content>
				<Item.Title class="line-clamp-1">
					{work.title}{#if isNew(work)}<Badge variant="secondary" class="ml-2 align-middle"
							>New</Badge
						>{/if}
				</Item.Title>
				<Item.Description class="flex items-center gap-1.5">
					{#if showCourse}
						<span class="truncate">{work.courseName}</span>
						<span aria-hidden="true">·</span>
					{/if}
					<span class="shrink-0 tabular-nums">{formatDue(work.dueAt, work.hasDueTime)}</span>
					{#if work.maxPoints}
						<span aria-hidden="true">·</span>
						<span class="shrink-0 tabular-nums">{work.maxPoints} pts</span>
					{/if}
				</Item.Description>
			</Item.Content>
			<Item.Actions>
				<StatusBadge {work} />
			</Item.Actions>
		</a>
	{/snippet}
</Item.Root>
