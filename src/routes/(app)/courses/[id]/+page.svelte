<script lang="ts">
	import { page } from '$app/state';
	import { setSearchParam } from '#lib/navigation.ts';
	import { groupBy } from '#lib/group.ts';
	import { useLiveQuery, eq } from '@tanstack/svelte-db';
	import { announcements, courses, materials, topics } from '#lib/db/collections.ts';
	import { workInCourse } from '#lib/db/queries.ts';
	import { isOpen, summarize } from '#lib/work.ts';
	import * as Tabs from '#lib/components/ui/tabs/index.js';
	import * as Item from '#lib/components/ui/item/index.js';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import WorkItem from '#lib/components/work-item.svelte';
	import Announcement from '#lib/components/announcement.svelte';
	import { formatRelative } from '#lib/format.ts';
	import { courseLabel, displayName } from '#lib/course.ts';
	import { pluralize } from '#lib/text.ts';
	import { courseColorName } from '#lib/course-colors.svelte.ts';
	import { withAuthUser } from '#lib/link-authuser.svelte.ts';
	import { OpenInNew as OpenInNewIcon } from '@material-symbols-svg/svelte/rounded/icons/open-in-new';
	import { MenuBook as MenuBookIcon } from '@material-symbols-svg/svelte/rounded/icons/menu-book';
	import { Inbox as InboxIcon } from '@material-symbols-svg/svelte/rounded/icons/inbox';
	import PersonList from './person-list.svelte';
	import GradesTab from './grades-tab.svelte';

	const courseQuery = useLiveQuery({
		query: (q) =>
			q
				.from({ c: courses })
				.where(({ c }) => eq(c.id, page.params.id))
				.findOne()
	});
	const workQuery = useLiveQuery({ query: (q) => workInCourse(q, page.params.id) });
	const materialQuery = useLiveQuery({
		query: (q) => q.from({ m: materials }).where(({ m }) => eq(m.courseId, page.params.id))
	});
	const topicQuery = useLiveQuery({
		query: (q) =>
			q
				.from({ t: topics })
				.where(({ t }) => eq(t.courseId, page.params.id))
				.orderBy(({ t }) => t.name, 'asc')
	});
	const streamQuery = useLiveQuery({
		query: (q) =>
			q
				.from({ a: announcements })
				.where(({ a }) => eq(a.courseId, page.params.id))
				.orderBy(({ a }) => a.updatedAt, 'desc')
	});

	const course = $derived(courseQuery.data);
	const description = $derived(courseLabel(course?.description));
	const work = $derived(
		course ? workQuery.data.map((r) => summarize(r.w, r.s ?? undefined, displayName(course))) : []
	);

	let tab = $state(page.url.searchParams.get('tab') ?? 'classwork');
	function setTab(value: string) {
		tab = value;
		setSearchParam('tab', value, 'classwork');
	}

	type Entry =
		| { kind: 'work'; rank: number; at: number; item: (typeof work)[number] }
		| { kind: 'material'; rank: number; at: number; item: (typeof materialQuery.data)[number] };
	const byRank = (a: Entry, b: Entry) =>
		a.rank - b.rank || (a.rank === 0 ? a.at - b.at : b.at - a.at);
	const sections = $derived.by(() => {
		const entries: Entry[] = [
			...work.map((w) =>
				isOpen(w)
					? { kind: 'work' as const, rank: 0, at: w.dueAt ?? Infinity, item: w }
					: { kind: 'work' as const, rank: 1, at: w.dueAt ?? w.updatedAt, item: w }
			),
			...materialQuery.data.map((m) => ({
				kind: 'material' as const,
				rank: 1,
				at: m.updatedAt,
				item: m
			}))
		];
		const byTopic = groupBy(entries, (e) => e.item.topicId);
		const list = [
			...topicQuery.data.map((t) => ({ id: t.id as string | undefined, name: t.name })),
			{ id: undefined, name: 'No topic' }
		];
		return list
			.map((t) => ({ ...t, entries: (byTopic.get(t.id) ?? []).sort(byRank) }))
			.filter((t) => t.entries.length);
	});
	const openCount = $derived(work.filter(isOpen).length);

	$effect(() => {
		const hash = page.url.hash;
		if (!hash || streamQuery.data.length === 0) return;
		const el = document.getElementById(hash.slice(1));
		el?.scrollIntoView({ block: 'center' });
	});
</script>

{#if course}
	<!-- Classroom's class banner, drawn with the course's tonal colours and M3 Expressive shapes -->
	<div
		data-course-color={courseColorName(course.id)}
		class="relative isolate flex min-h-32 flex-wrap items-end justify-between gap-4 overflow-hidden rounded-3xl bg-course-container p-5 text-on-course-container sm:p-6"
	>
		<span
			class="absolute -top-16 -right-10 -z-10 size-64 rotate-12 rounded-[38%] bg-course opacity-25"
			aria-hidden="true"
		></span>
		<span
			class="absolute -right-4 -bottom-20 -z-10 size-44 rounded-full bg-course opacity-20 max-sm:hidden sm:right-56"
			aria-hidden="true"
		></span>
		<div class="min-w-0">
			<h1 class="text-headline-lg text-balance sm:text-display-sm">{displayName(course)}</h1>
			<p class="mt-2 text-title-md opacity-80">
				{[course.nickname ? course.name : undefined, courseLabel(course.section), course.room]
					.filter(Boolean)
					.join(' · ')}{#if openCount}
					· {pluralize(openCount, 'open assignment')}{/if}
			</p>
		</div>
		{#if course.alternateLink}
			<Button
				variant="secondary"
				class="bg-surface-container-lowest/70 text-on-surface"
				href={withAuthUser(course.alternateLink)}
				target="_blank"
				rel="noreferrer"
			>
				Open in Classroom <OpenInNewIcon data-icon="inline-end" />
			</Button>
		{/if}
	</div>

	<Tabs.Root value={tab} onValueChange={setTab} class="mt-6">
		<Tabs.List variant="line" class="w-full justify-start">
			<Tabs.Trigger value="classwork" class="flex-none">Classwork</Tabs.Trigger>
			<Tabs.Trigger value="stream" class="flex-none">Stream</Tabs.Trigger>
			<Tabs.Trigger value="people" class="flex-none">People</Tabs.Trigger>
			<Tabs.Trigger value="grades" class="flex-none">Grades</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="classwork" class="mt-4">
			{#if sections.length === 0}
				<Empty.Root class="bg-surface-container-low">
					<Empty.Header>
						<Empty.Media variant="icon"><InboxIcon /></Empty.Media>
						<Empty.Title>No classwork yet</Empty.Title>
						<Empty.Description
							>Assignments and materials will appear here after the next sync.</Empty.Description
						>
					</Empty.Header>
				</Empty.Root>
			{:else}
				<div class="flex flex-col gap-8">
					{#each sections as section (section.id ?? 'none')}
						<section>
							<h2 class="border-b border-outline-variant pb-2 text-title-lg text-on-surface">
								{section.name}
							</h2>
							<div class="mt-4 segmented">
								{#each section.entries as entry (entry.kind + entry.item.id)}
									{#if entry.kind === 'work'}
										<WorkItem work={entry.item} showCourse={false} />
									{:else}
										<Item.Root
											size="sm"
											class="state-layer gap-4 border-0 px-4 py-3 transition-[border-radius] duration-300 ease-spring-gentle hover:rounded-xl [a]:hover:bg-transparent"
										>
											{#snippet child({ props })}
												<a href={`/courses/${course.id}/material/${entry.item.id}`} {...props}>
													<span
														class="flex size-10 shrink-0 items-center justify-center rounded-full bg-tertiary-container text-on-tertiary-container"
														><MenuBookIcon class="size-6" /></span
													>
													<Item.Content>
														<Item.Title class="line-clamp-1 text-title-sm"
															>{entry.item.title}</Item.Title
														>
														<Item.Description class="text-body-md text-on-surface-variant"
															>Material · {pluralize(entry.item.materials.length, 'attachment')} · {formatRelative(
																entry.item.updatedAt
															)}</Item.Description
														>
													</Item.Content>
												</a>
											{/snippet}
										</Item.Root>
									{/if}
								{/each}
							</div>
						</section>
					{/each}
				</div>
			{/if}
		</Tabs.Content>
		<Tabs.Content
			value="stream"
			class="mt-4 flex flex-col gap-3 *:rounded-2xl *:bg-surface-container-low *:px-4"
		>
			{#each streamQuery.data as item (item.id)}
				<Announcement {item} {course} showCourse={false} />
			{:else}
				<p class="py-6 text-body-md text-on-surface-variant">No announcements in this course.</p>
			{/each}
		</Tabs.Content>
		<Tabs.Content value="people" class="mt-4">
			<h2 class="border-b border-outline-variant pb-2 text-title-lg text-on-surface">Teachers</h2>
			<PersonList people={course.teachers} variant="teacher" />
			{#if course.students?.length}
				<h2 class="mt-8 border-b border-outline-variant pb-2 text-title-lg text-on-surface">
					Classmates <span class="text-on-surface-variant tabular-nums"
						>· {course.studentCount ?? course.students.length}</span
					>
				</h2>
				<PersonList people={course.students} variant="student" />
			{/if}
			{#if description}
				<h2 class="mt-8 border-b border-outline-variant pb-2 text-title-lg text-on-surface">
					{course.descriptionHeading || 'About'}
				</h2>
				<p class="mt-2 text-body-md text-pretty whitespace-pre-wrap text-on-surface-variant">
					{description}
				</p>
			{/if}
		</Tabs.Content>
		<Tabs.Content value="grades" class="mt-4">
			<GradesTab {work} courseId={course.id} />
		</Tabs.Content>
	</Tabs.Root>
{/if}
