<script lang="ts">
	import * as Command from '#lib/components/ui/command/index.js';
	import { goto, preloadData } from '$app/navigation';
	import { createSearch, kindIcon } from '#lib/search.svelte.ts';
	import { formatDue } from '#lib/format.ts';
	import { displayName, type CourseRef as Course } from '#lib/course.ts';
	import CourseDot from '#lib/components/course-dot.svelte';
	import { Home as HomeIcon } from '@material-symbols-svg/svelte/rounded/icons/home';
	import { Checklist as ChecklistIcon } from '@material-symbols-svg/svelte/rounded/icons/checklist';
	import { Inbox as InboxIcon } from '@material-symbols-svg/svelte/rounded/icons/inbox';
	import { Settings as SettingsIcon } from '@material-symbols-svg/svelte/rounded/icons/settings';
	import { Search as SearchIcon } from '@material-symbols-svg/svelte/rounded/icons/search';

	let { open = $bindable(false), courses }: { open?: boolean; courses: Course[] } = $props();

	let query = $state('');
	const trimmed = $derived(query.trim());
	const search = createSearch(() => (open ? trimmed : ''), 12);
	const hits = $derived(search.hits);
	const loading = $derived(search.loading);
	const pages = [
		{ href: '/', label: 'Home', icon: HomeIcon },
		{ href: '/inbox', label: 'Inbox', icon: InboxIcon },
		{ href: '/todo', label: 'To-do', icon: ChecklistIcon },
		{ href: '/settings', label: 'Settings', icon: SettingsIcon }
	];
	const matches = (label: string) => {
		const q = trimmed.toLowerCase();
		const l = label.toLowerCase();
		return l.includes(q) || q.split(/\s+/).every((t) => l.includes(t));
	};
	const courseHits = $derived(
		trimmed
			? courses
					.filter((c) => matches(displayName(c)))
					.sort(
						(a, b) =>
							displayName(a).toLowerCase().indexOf(trimmed.toLowerCase()) -
								displayName(b).toLowerCase().indexOf(trimmed.toLowerCase()) ||
							displayName(a).length - displayName(b).length
					)
					.slice(0, 5)
			: courses
	);
	const pageHits = $derived(trimmed ? pages.filter((p) => matches(p.label)) : pages);
	const results = $derived(
		hits.filter((h) => h.doc.kind !== 'course' || !courseHits.some((c) => c.id === h.doc.id))
	);

	function go(href: string) {
		open = false;
		goto(href);
	}

	$effect(() => {
		if (!open) query = '';
	});
</script>

<Command.Dialog
	bind:open
	shouldFilter={false}
	onValueChange={(v) => v.startsWith('/') && preloadData(v)}
	title="Search"
	description="Search classwork, materials and announcements"
	class="top-[12vh] sm:max-w-2xl"
>
	<Command.Input bind:value={query} placeholder="Search classwork, announcements, courses…" />
	<Command.List class="max-h-[60dvh]">
		<Command.Empty>{loading ? 'Searching…' : 'No results.'}</Command.Empty>
		{#if pageHits.length}
			<Command.Group heading="Pages">
				{#each pageHits as p (p.href)}
					<Command.Item value={p.href} onSelect={() => go(p.href)}>
						<p.icon class="text-on-surface-variant" />
						<span>{p.label}</span>
					</Command.Item>
				{/each}
			</Command.Group>
		{/if}
		{#if courseHits.length}
			<Command.Group heading="Courses">
				{#each courseHits as course (course.id)}
					<Command.Item
						value={`/courses/${course.id}`}
						onSelect={() => go(`/courses/${course.id}`)}
					>
						<CourseDot id={course.id} size="md" class="mx-[7px]" />
						<span>{displayName(course)}</span>
					</Command.Item>
				{/each}
			</Command.Group>
		{/if}
		{#if results.length}
			<Command.Group heading="Results">
				{#each results as hit (hit.doc.kind + hit.doc.id)}
					{@const Icon = kindIcon[hit.doc.kind]}
					<Command.Item value={hit.doc.href} onSelect={() => go(hit.doc.href)}>
						<Icon class="text-on-surface-variant" />
						<div class="grid min-w-0 flex-1">
							<span class="truncate">{hit.doc.title}</span>
							<span class="flex items-center gap-1.5 truncate text-body-md text-on-surface-variant">
								<CourseDot id={hit.doc.courseId} class="shrink-0" />
								{hit.doc.courseName}
								{#if hit.doc.dueAt}<span aria-hidden="true">·</span><span class="tabular-nums"
										>{formatDue(hit.doc.dueAt, true)}</span
									>{/if}
							</span>
						</div>
					</Command.Item>
				{/each}
			</Command.Group>
		{/if}
		{#if trimmed}
			<Command.Item
				value={`/search?q=${encodeURIComponent(trimmed)}`}
				onSelect={() => go(`/search?q=${encodeURIComponent(trimmed)}`)}
			>
				<SearchIcon class="text-on-surface-variant" />
				<span>See all results for “{trimmed}”</span>
			</Command.Item>
		{/if}
	</Command.List>
</Command.Dialog>
