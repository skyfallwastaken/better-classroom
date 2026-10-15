<script lang="ts">
	import { page } from '$app/state';
	import { useLiveQuery } from '@tanstack/svelte-db';
	import { createHotkey } from '@tanstack/svelte-hotkeys';
	import { setSearchParam } from '#lib/navigation.ts';
	import { workWithContext } from '#lib/db/queries.ts';
	import { displayName } from '#lib/course.ts';
	import { pluralize } from '#lib/text.ts';
	import { notify } from '#lib/toast.ts';
	import { celebrate } from '#lib/celebrate.ts';
	import { createSelection } from '#lib/selection.svelte.ts';
	import { runBatch, type Progress, type SubmissionAction } from '#lib/submissions.ts';
	import { summarize, byDue, canReclaim, canTurnIn, type WorkSummary } from '#lib/work.ts';
	import { bucketize, inTab, type TodoTab } from '#lib/todo.ts';
	import * as Tabs from '#lib/components/ui/tabs/index.js';
	import * as Select from '#lib/components/ui/select/index.js';
	import * as ToggleGroup from '#lib/components/ui/toggle-group/index.js';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import BulkProgressDialog from '#lib/components/bulk-progress-dialog.svelte';
	import { List as ListIcon } from '@material-symbols-svg/svelte/rounded/icons/list';
	import { CalendarMonth as CalendarIcon } from '@material-symbols-svg/svelte/rounded/icons/calendar-month';
	import { Celebration as CelebrationIcon } from '@material-symbols-svg/svelte/rounded/icons/celebration';
	import TodoSection from './todo-section.svelte';
	import SelectionToolbar from './selection-toolbar.svelte';
	import WeekGrid from './week-grid.svelte';

	const workQuery = useLiveQuery({ query: workWithContext });
	const all = $derived(
		workQuery.data.map((r) => summarize(r.w, r.s ?? undefined, displayName(r.c))).sort(byDue)
	);
	const classes = $derived(
		[...new Map(all.map((w) => [w.courseId, w.courseName])).entries()]
			.map(([id, name]) => ({ id, name }))
			.sort((a, b) => a.name.localeCompare(b.name))
	);

	type View = 'list' | 'week';
	const TABS: TodoTab[] = ['assigned', 'missing', 'done'];
	// `open` and `all` were the old filter names; both land on Assigned.
	const readTab = (v: string | null): TodoTab =>
		TABS.includes(v as TodoTab) ? (v as TodoTab) : 'assigned';
	const readView = (v: string | null): View => (v === 'week' ? 'week' : 'list');

	let tab = $state<TodoTab>(readTab(page.url.searchParams.get('filter')));
	let view = $state<View>(readView(page.url.searchParams.get('view')));
	let course = $state(page.url.searchParams.get('course') ?? 'all');

	const inClass = $derived(course === 'all' ? all : all.filter((w) => w.courseId === course));
	const buckets = $derived(bucketize(tab, inClass));
	const rows = $derived(buckets.flatMap((b) => b.items));
	const courseLabel = $derived(classes.find((c) => c.id === course)?.name ?? 'All classes');

	// Like Classroom, open the first dated group that has work; "No due date" only if nothing else does.
	const defaultOpen = $derived(
		(buckets.find((b) => b.id !== 'none' && b.items.length) ?? buckets.find((b) => b.items.length))
			?.id
	);
	let toggled = $state<Record<string, boolean>>({});
	const openKey = (id: string) => `${tab}|${course}|${id}`;

	function setTab(v: string) {
		tab = readTab(v);
		setSearchParam('filter', tab, 'assigned');
	}
	function setView(v: string) {
		view = readView(v);
		setSearchParam('view', view, 'list');
	}
	function setCourse(v: string) {
		course = v || 'all';
		setSearchParam('course', course, 'all');
	}

	const selection = createSelection(() => rows.map((r) => r.id));
	const indexById = $derived(new Map(rows.map((r, i) => [r.id, i])));
	const selectedRows = $derived(rows.filter((r) => selection.has(r.id)));
	createHotkey('Escape', () => selection.clear(), { ignoreInputs: true });

	const turnInable = $derived(selectedRows.filter(canTurnIn));
	const reclaimable = $derived(selectedRows.filter(canReclaim));

	let batchOpen = $state(false);
	let batchTitle = $state('');
	let batchItems = $state<Progress[]>([]);
	let batchBusy = $state(false);
	const MODAL_THRESHOLD = 3;

	async function bulk(action: SubmissionAction, items: WorkSummary[]) {
		if (!items.length || batchBusy) return;
		const verb = action === 'turnIn' ? 'Marking done' : 'Unsubmitting';
		batchBusy = true;
		const modal = items.length > MODAL_THRESHOLD;
		if (modal) {
			batchTitle = `${verb} ${pluralize(items.length, 'assignment')}`;
			batchItems = [];
			batchOpen = true;
		}
		try {
			const result = await runBatch(action, items, (p) => (batchItems = p));
			const failed = result.filter((p) => p.state === 'failed');
			const done = result.length - failed.length;
			selection.clear();
			if (action === 'turnIn' && done > 0) celebrate();
			if (!modal) {
				if (failed.length)
					notify('rose', `${failed.length} of ${result.length} failed`, {
						description: failed[0].error
					});
				else
					notify(
						action === 'turnIn' ? 'emerald' : 'sky',
						action === 'turnIn'
							? `Marked ${pluralize(done, 'assignment')} done`
							: `Unsubmitted ${pluralize(done, 'assignment')}`,
						{
							action: {
								label: 'Undo',
								onClick: () =>
									bulk(
										action === 'turnIn' ? 'reclaim' : 'turnIn',
										items.filter((w) => result.find((p) => p.id === w.id)?.state === 'done')
									)
							}
						}
					);
			}
		} finally {
			batchBusy = false;
		}
	}

	const EMPTY: Record<TodoTab, { title: string; description: string }> = {
		assigned: { title: 'Woohoo, no work due soon!', description: 'Nothing is assigned right now.' },
		missing: { title: 'No missing work', description: 'You are all caught up.' },
		done: { title: 'Nothing done yet', description: 'Work you turn in shows up here.' }
	};
</script>

<Tabs.Root value={tab} onValueChange={setTab} class="-mt-8">
	<Tabs.List variant="line" class="w-full justify-start">
		<Tabs.Trigger value="assigned" class="flex-none">Assigned</Tabs.Trigger>
		<Tabs.Trigger value="missing" class="flex-none">Missing</Tabs.Trigger>
		<Tabs.Trigger value="done" class="flex-none">Done</Tabs.Trigger>
	</Tabs.List>
</Tabs.Root>

<div class="mx-auto mt-6 max-w-3xl">
	<div class="flex flex-wrap items-center justify-between gap-3">
		<Select.Root type="single" value={course} onValueChange={setCourse}>
			<Select.Trigger class="w-full sm:w-96" aria-label="Class">{courseLabel}</Select.Trigger>
			<Select.Content>
				<Select.Item value="all" label="All classes">All classes</Select.Item>
				{#each classes as c (c.id)}
					<Select.Item value={c.id} label={c.name}>{c.name}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		<ToggleGroup.Root
			type="single"
			variant="outline"
			value={view}
			onValueChange={(v) => v && setView(v)}
			aria-label="View"
		>
			<ToggleGroup.Item value="list" aria-label="List"><ListIcon /></ToggleGroup.Item>
			<ToggleGroup.Item value="week" aria-label="Week"><CalendarIcon /></ToggleGroup.Item>
		</ToggleGroup.Root>
	</div>

	{#if view === 'week'}
		<WeekGrid rows={inClass.filter((w) => inTab(tab, w))} />
	{:else if rows.length === 0}
		<Empty.Root class="mt-8">
			<Empty.Header>
				<Empty.Media
					variant="icon"
					class="size-20 rounded-[40%] bg-tertiary-container text-on-tertiary-container [&_svg]:size-10!"
					><CelebrationIcon /></Empty.Media
				>
				<Empty.Title class="text-headline-sm">{EMPTY[tab].title}</Empty.Title>
				<Empty.Description>{EMPTY[tab].description}</Empty.Description>
			</Empty.Header>
		</Empty.Root>
	{:else}
		<div class="mt-4 flex flex-col gap-1 {selection.size ? 'pb-24' : ''}">
			{#each buckets as bucket (bucket.id)}
				<TodoSection
					{tab}
					{bucket}
					{selection}
					indexOf={(id) => indexById.get(id) ?? -1}
					bind:open={
						() => toggled[openKey(bucket.id)] ?? bucket.id === defaultOpen,
						(v) => (toggled[openKey(bucket.id)] = v)
					}
				/>
			{/each}
		</div>
	{/if}
</div>

{#if selection.size}
	<SelectionToolbar
		count={selection.size}
		turnInable={turnInable.length}
		reclaimable={reclaimable.length}
		busy={batchBusy}
		onTurnIn={() => bulk('turnIn', turnInable)}
		onReclaim={() => bulk('reclaim', reclaimable)}
		onClear={() => selection.clear()}
	/>
{/if}

<BulkProgressDialog bind:open={batchOpen} title={batchTitle} items={batchItems} />
