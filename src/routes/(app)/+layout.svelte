<script lang="ts">
	import { untrack } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { createHotkey, createHotkeySequence } from '@tanstack/svelte-hotkeys';
	import { DbProvider, useLiveQuery } from '@tanstack/svelte-db';
	import { byDisplayName } from '#lib/course.ts';
	import * as Sidebar from '#lib/components/ui/sidebar/index.js';
	import * as Breadcrumb from '#lib/components/ui/breadcrumb/index.js';
	import { Kbd, KbdGroup } from '#lib/components/ui/kbd/index.js';
	import AppSidebar from '#lib/components/app-sidebar.svelte';
	import UserAvatar from '#lib/components/user-avatar.svelte';
	import logo from '#lib/assets/favicon.png';
	import CommandMenu from '#lib/components/command-menu.svelte';
	import FirstSyncBanner from '#lib/components/first-sync-banner.svelte';
	import RenameCourseDialog from '#lib/components/rename-course-dialog.svelte';
	import { courseEditor } from '#lib/course-editor.svelte.ts';
	import { createDb } from '#lib/db/client.ts';
	import { courses as coursesCollection } from '#lib/db/collections.ts';
	import {
		allDismissals,
		inboxAnnouncements,
		inboxKey,
		inboxMaterials,
		workWithContext
	} from '#lib/db/queries.ts';
	import { live, primeLive } from '#lib/db/live.svelte.ts';
	import { syncColorOverrides } from '#lib/course-colors.svelte.ts';
	import { initNotifications, watchForNewItems } from '#lib/notifications.svelte.ts';
	import { titleBadge } from '#lib/title.svelte.ts';
	import { workStatus } from '#lib/shared/status.ts';
	import { isOpen } from '#lib/work.ts';
	import { notify } from '#lib/toast.ts';
	import { Search as SearchIcon } from '@material-symbols-svg/svelte/rounded/icons/search';
	import { Sync as SyncIcon } from '@material-symbols-svg/svelte/rounded/icons/sync';

	let { children, data } = $props();
	const initial = untrack(() => data.snapshot);
	const client = createDb(initial);
	primeLive(initial.sync);
	syncColorOverrides(initial.courses);

	let paletteOpen = $state(false);
	createHotkey('Mod+K', () => (paletteOpen = !paletteOpen), { preventDefault: true });
	createHotkeySequence(['G', 'H'], () => goto('/'));
	createHotkeySequence(['G', 'I'], () => goto('/inbox'));
	createHotkeySequence(['G', 'T'], () => goto('/todo'));
	createHotkeySequence(['G', 'S'], () => goto('/settings'));

	const allCoursesQuery = useLiveQuery({
		client,
		query: (q) => q.from({ c: coursesCollection })
	});
	$effect(() => syncColorOverrides(allCoursesQuery.data));
	const courses = $derived(allCoursesQuery.data.filter((c) => !c.hidden).sort(byDisplayName));
	const courseById = $derived(new Map(allCoursesQuery.data.map((c) => [c.id, c])));
	$effect(() => void initNotifications());
	$effect(() => watchForNewItems((id) => courseById.get(id)));

	const inboxAnnouncementsQuery = useLiveQuery({ client, query: inboxAnnouncements });
	const inboxMaterialsQuery = useLiveQuery({ client, query: inboxMaterials });
	const dismissalsQuery = useLiveQuery({ client, query: allDismissals });
	const inboxCount = $derived.by(() => {
		const done = new Set(dismissalsQuery.data.map((d) => d.id));
		let n = 0;
		for (const r of inboxAnnouncementsQuery.data)
			if (!done.has(inboxKey('announcement', r.a.id))) n++;
		for (const r of inboxMaterialsQuery.data) if (!done.has(inboxKey('material', r.m.id))) n++;
		return n;
	});
	$effect(() => {
		titleBadge.count = inboxCount;
	});

	const workQuery = useLiveQuery({ client, query: workWithContext });
	const todoCount = $derived.by(() => {
		const now = Date.now();
		let n = 0;
		for (const r of workQuery.data) {
			if (isOpen({ status: workStatus(r.s ?? undefined, r.w.dueAt, now) })) n++;
		}
		return n;
	});

	const profile = $derived<{ name?: string; photoUrl?: string }>(
		data.snapshot.profile ?? { name: data.user?.name }
	);
	const crumbs = $derived((page.data.crumbs ?? []) as { label: string; href?: string }[]);
	const mobileTitle = $derived((page.data.title as string | undefined) ?? crumbs.at(-1)?.label);
	const syncing = $derived(live.sync?.status === 'running');
	let lastStatus = live.sync?.status;
	$effect(() => {
		const sync = live.sync;
		if (!sync) return;
		const prev = lastStatus;
		lastStatus = sync.status;
		if (prev !== 'running' || sync.status !== 'error') return;
		notify('rose', 'Sync failed', { description: sync.error?.split('\n')[0], duration: 8000 });
	});
</script>

<DbProvider {client}>
	<Sidebar.Provider>
		<!-- M3 top app bar spanning the drawer and the content, as in Classroom -->
		<header
			class="fixed inset-x-0 top-0 z-20 flex h-16 items-center gap-1 bg-sidebar pr-3 pl-2 sm:pr-4"
		>
			<Sidebar.Trigger />
			<a
				href="/"
				class="flex shrink-0 items-center gap-2.5 rounded-full py-1 pr-3 pl-1.5 text-title-lg text-on-surface-variant hover:text-on-surface"
			>
				<img src={logo} alt="" class="size-8" />
				<span class="max-sm:hidden">Classroom</span>
			</a>
			{#if crumbs.length}
				<Breadcrumb.Root class="min-w-0 max-sm:hidden">
					<Breadcrumb.List class="flex-nowrap text-title-md text-on-surface-variant">
						{#each crumbs as crumb, i (i)}
							<Breadcrumb.Separator class="[&>svg]:size-6" />
							<Breadcrumb.Item class="min-w-0">
								{#if crumb.href && i < crumbs.length - 1}
									<Breadcrumb.Link href={crumb.href} class="truncate">{crumb.label}</Breadcrumb.Link
									>
								{:else}
									<Breadcrumb.Page class="truncate text-on-surface">{crumb.label}</Breadcrumb.Page>
								{/if}
							</Breadcrumb.Item>
						{/each}
					</Breadcrumb.List>
				</Breadcrumb.Root>
			{/if}
			{#if mobileTitle}
				<span class="min-w-0 truncate text-title-md sm:hidden">{mobileTitle}</span>
			{/if}
			<div class="ml-auto flex items-center gap-2">
				{#if syncing}
					<span
						class="flex items-center gap-1.5 text-label-md text-on-surface-variant max-sm:hidden"
						><SyncIcon class="size-4 animate-spin" />Syncing</span
					>
				{/if}
				<!-- M3 search bar: a full-pill surface that opens the command palette -->
				<button
					type="button"
					class="state-layer flex h-12 items-center gap-3 rounded-full bg-surface-container-highest px-4 text-body-lg text-on-surface-variant transition-[border-radius] duration-300 ease-spring-gentle active:rounded-xl max-sm:size-12 max-sm:justify-center max-sm:px-0 sm:w-64 lg:w-80"
					onclick={() => (paletteOpen = true)}
				>
					<SearchIcon class="size-6 shrink-0" />
					<span class="text-base max-sm:sr-only">Search</span>
					<KbdGroup class="ml-auto max-sm:hidden"><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
				</button>
				<a
					href="/settings"
					class="rounded-full p-1 outline-primary hover:bg-on-surface/8 focus-visible:outline-2"
					aria-label="Account and settings"
				>
					<UserAvatar src={profile?.photoUrl} name={profile?.name} class="size-8" />
				</a>
			</div>
		</header>
		<AppSidebar {courses} {inboxCount} {todoCount} />
		<Sidebar.Inset class="isolate">
			<FirstSyncBanner />
			<main class="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-10">
				{@render children()}
			</main>
		</Sidebar.Inset>
	</Sidebar.Provider>

	<CommandMenu bind:open={paletteOpen} {courses} />
	<RenameCourseDialog bind:course={courseEditor.course} />
</DbProvider>
