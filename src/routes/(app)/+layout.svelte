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
			if (isOpen({ status: workStatus(r.s ?? undefined, r.w, now) })) n++;
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
		<!-- M3 small top app bar (Compose AppBarSmallTokens/AppBarTokens): 64px, 4px leading and
		     trailing space, title-large title, 24px icons, 32px avatar in a 48px target. It spans
		     the drawer and the content, as in Classroom. -->
		<header class="fixed inset-x-0 top-0 z-20 flex h-16 items-center gap-1 bg-sidebar px-1">
			<Sidebar.Trigger class="size-12 text-on-surface [&_svg]:size-6" />
			<a
				href="/"
				class="state-layer flex h-12 shrink-0 items-center gap-2.5 rounded-full pr-3 pl-1.5 text-title-lg text-on-surface-variant outline-primary focus-visible:outline-2"
			>
				<img src={logo} alt="" class="size-8" />
				<span class="max-sm:sr-only">Classroom</span>
			</a>
			{#if crumbs.length}
				<Breadcrumb.Root class="min-w-0 max-sm:hidden">
					<Breadcrumb.List class="flex-nowrap text-title-md">
						{#each crumbs as crumb, i (i)}
							<Breadcrumb.Separator />
							<Breadcrumb.Item class="min-w-0">
								{#if crumb.href && i < crumbs.length - 1}
									<Breadcrumb.Link href={crumb.href} class="truncate py-2"
										>{crumb.label}</Breadcrumb.Link
									>
								{:else}
									<Breadcrumb.Page class="truncate py-2">{crumb.label}</Breadcrumb.Page>
								{/if}
							</Breadcrumb.Item>
						{/each}
					</Breadcrumb.List>
				</Breadcrumb.Root>
			{/if}
			{#if mobileTitle}
				<span class="min-w-0 truncate text-title-lg text-on-surface sm:hidden">{mobileTitle}</span>
			{/if}
			<div class="ml-auto flex items-center gap-1">
				{#if syncing}
					<span
						class="flex items-center gap-1.5 text-label-md text-on-surface-variant max-sm:hidden"
						><SyncIcon class="size-4 animate-spin" />Syncing</span
					>
				{/if}
				<!-- M3 search bar (Compose SearchBarTokens): full-pill container, on-surface leading icon,
				     body-large on-surface-variant supporting text. Kept at 48px so it sits inside the
				     64px bar, one tone above the bar's surface-container. -->
				<button
					type="button"
					class="state-layer flex h-12 items-center gap-4 rounded-full bg-surface-container-highest px-4 text-body-lg text-on-surface-variant outline-primary focus-visible:outline-2 max-sm:size-12 max-sm:justify-center max-sm:bg-transparent max-sm:px-0 sm:w-64 lg:w-80"
					onclick={() => (paletteOpen = true)}
				>
					<SearchIcon class="size-6 shrink-0 text-on-surface" />
					<span class="max-sm:sr-only">Search</span>
					<KbdGroup class="ml-auto max-sm:hidden"><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
				</button>
				<a
					href="/settings"
					class="state-layer rounded-full p-2 text-on-surface outline-primary focus-visible:outline-2"
					aria-label="Account and settings"
				>
					<UserAvatar src={profile?.photoUrl} name={profile?.name} class="size-8" />
				</a>
			</div>
		</header>
		<AppSidebar {courses} {inboxCount} {todoCount} />
		<Sidebar.Inset class="isolate">
			<FirstSyncBanner />
			<main class="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
				{@render children()}
			</main>
		</Sidebar.Inset>
	</Sidebar.Provider>

	<CommandMenu bind:open={paletteOpen} {courses} />
	<RenameCourseDialog bind:course={courseEditor.course} />
</DbProvider>
