<script lang="ts">
	import { untrack } from 'svelte';
	import { setSearchParam } from '#lib/navigation.ts';
	import { createSearch, kindIcon, kindLabel } from '#lib/search.svelte.ts';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import * as Item from '#lib/components/ui/item/index.js';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import { formatDue, formatRelative } from '#lib/format.ts';
	import CourseDot from '#lib/components/course-dot.svelte';
	import PageHeader from '#lib/components/page-header.svelte';
	import { Search as SearchIcon } from '@material-symbols-svg/svelte/rounded/icons/search';

	let { data } = $props();
	let query = $state(untrack(() => data.q));
	const trimmed = $derived(query.trim());
	const search = createSearch(() => trimmed, 50);
	const hits = $derived(search.hits);
	const loading = $derived(search.loading);

	let timer: ReturnType<typeof setTimeout>;
	function onInput() {
		clearTimeout(timer);
		timer = setTimeout(() => setSearchParam('q', trimmed || null), 250);
	}
</script>

<PageHeader title="Search" />
<form class="mt-4 max-w-xl" onsubmit={(e) => e.preventDefault()} role="search">
	<div class="relative">
		<SearchIcon
			class="pointer-events-none absolute top-1/2 left-4 size-6 -translate-y-1/2 text-on-surface-variant"
		/>
		<Input
			name="q"
			type="search"
			bind:value={query}
			oninput={onInput}
			placeholder="Search assignments, materials, announcements…"
			aria-label="Search"
			class="h-12 rounded-full border-0 bg-surface-container-highest pl-12 text-body-lg md:text-body-lg"
			autofocus
		/>
	</div>
</form>

{#if trimmed}
	<p class="mt-4 text-body-md text-on-surface-variant tabular-nums">
		{#if loading && !hits.length}Searching…{:else}{hits.length} result{hits.length === 1 ? '' : 's'} for
			“{trimmed}”{/if}
	</p>
{/if}

{#if trimmed && hits.length === 0 && !loading}
	<Empty.Root class="mt-6">
		<Empty.Header>
			<Empty.Media variant="icon"><SearchIcon /></Empty.Media>
			<Empty.Title>No results</Empty.Title>
			<Empty.Description>Try a different spelling, or fewer words.</Empty.Description>
		</Empty.Header>
	</Empty.Root>
{:else if hits.length}
	<div class="mt-4 segmented">
		{#each hits as hit (hit.doc.kind + hit.doc.id)}
			{@const Icon = kindIcon[hit.doc.kind]}
			<Item.Root
				size="sm"
				class="state-layer gap-4 border-0 px-4 py-3 transition-[border-radius] duration-300 ease-spring-gentle hover:rounded-xl [a]:hover:bg-transparent"
			>
				{#snippet child({ props })}
					<a href={hit.doc.href} {...props}>
						<span
							aria-hidden="true"
							class="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-container-highest text-on-surface-variant [&_svg]:size-6"
							><Icon /></span
						>
						<Item.Content>
							<Item.Title class="line-clamp-1 text-title-sm">{hit.doc.title}</Item.Title>
							{#if hit.doc.snippet && hit.doc.kind !== 'announcement'}
								<p class="line-clamp-2 text-body-md text-on-surface-variant">{hit.doc.snippet}</p>
							{/if}
							<Item.Description
								class="flex items-center gap-1.5 text-body-md text-on-surface-variant"
							>
								<CourseDot id={hit.doc.courseId} class="shrink-0" />
								<span class="truncate">{hit.doc.courseName}</span>
								<span aria-hidden="true">·</span>
								<span class="tabular-nums"
									>{hit.doc.dueAt
										? formatDue(hit.doc.dueAt, true)
										: formatRelative(hit.doc.updatedAt)}</span
								>
							</Item.Description>
						</Item.Content>
						<Item.Actions><Badge variant="secondary">{kindLabel[hit.doc.kind]}</Badge></Item.Actions
						>
					</a>
				{/snippet}
			</Item.Root>
		{/each}
	</div>
{/if}
