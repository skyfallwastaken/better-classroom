<script lang="ts">
	import { useLiveQuery } from '@tanstack/svelte-db';
	import { courses } from '#lib/db/collections.ts';
	import { byDisplayName, displayName } from '#lib/course.ts';
	import { editCourse } from '#lib/course-editor.svelte.ts';
	import { setCourseHidden } from '#lib/course-actions.ts';
	import CourseDot from '#lib/components/course-dot.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Visibility as VisibilityIcon } from '@material-symbols-svg/svelte/rounded/icons/visibility';
	import { VisibilityOff as VisibilityOffIcon } from '@material-symbols-svg/svelte/rounded/icons/visibility-off';
	import { Edit as EditIcon } from '@material-symbols-svg/svelte/rounded/icons/edit';

	const courseQuery = useLiveQuery({ query: (q) => q.from({ c: courses }) });
	const sorted = $derived(courseQuery.data.slice().sort(byDisplayName));
	const visible = $derived(sorted.filter((c) => !c.hidden));
	const hidden = $derived(sorted.filter((c) => c.hidden));
</script>

<div class="w-full">
	<p class="max-w-[65ch] text-body-md text-pretty text-on-surface-variant">
		Nicknames and colors only change how courses look here. Hidden courses stay synced but leave the
		sidebar, To-do, Home and search.
	</p>
	<ul role="list" class="mt-4 divide-y divide-outline-variant">
		{#each visible as course (course.id)}
			<li class="flex items-center gap-3 py-2">
				<CourseDot id={course.id} size="lg" class="shrink-0" />
				<span class="min-w-0 flex-1 truncate text-body-md"
					>{displayName(course)}{#if course.nickname}<span class="text-on-surface-variant">
							· {course.name}</span
						>{/if}</span
				>
				<Button variant="ghost" size="icon-sm" aria-label="Edit" onclick={() => editCourse(course)}
					><EditIcon /></Button
				>
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label="Hide"
					onclick={() => setCourseHidden(course, true)}><VisibilityOffIcon /></Button
				>
			</li>
		{:else}
			<li class="py-3 text-body-md text-on-surface-variant">No courses synced yet.</li>
		{/each}
	</ul>
	{#if hidden.length}
		<h2 class="mt-8 text-title-md">Hidden</h2>
		<ul role="list" class="mt-2 divide-y divide-outline-variant">
			{#each hidden as course (course.id)}
				<li class="flex items-center gap-3 py-2 opacity-70">
					<CourseDot id={course.id} size="lg" class="shrink-0" />
					<span class="min-w-0 flex-1 truncate text-body-md">{displayName(course)}</span>
					<Button variant="outline" size="sm" onclick={() => setCourseHidden(course, false)}
						><VisibilityIcon data-icon="inline-start" />Show</Button
					>
				</li>
			{/each}
		</ul>
	{/if}
</div>
