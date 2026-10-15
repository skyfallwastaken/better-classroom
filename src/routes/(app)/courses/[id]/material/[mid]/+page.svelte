<script lang="ts">
	import { page } from '$app/state';
	import { useLiveQuery, eq } from '@tanstack/svelte-db';
	import { courses, materials } from '#lib/db/collections.ts';
	import { topicById } from '#lib/db/queries.ts';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import Attachments from '#lib/components/attachments.svelte';
	import RichText from '#lib/components/rich-text.svelte';
	import PostHeader from '#lib/components/post-header.svelte';
	import { formatRelative } from '#lib/format.ts';
	import { MenuBook as MenuBookIcon } from '@material-symbols-svg/svelte/rounded/icons/menu-book';

	const row = useLiveQuery({
		query: (q) =>
			q
				.from({ m: materials })
				.where(({ m }) => eq(m.id, page.params.mid))
				.innerJoin({ c: courses }, ({ m, c }) => eq(m.courseId, c.id))
				.findOne()
	});
	const topicQuery = useLiveQuery({ query: (q) => topicById(q, row.data?.m.topicId) });
	const m = $derived(row.data?.m);
	const teacher = $derived(
		row.data?.m.author?.name ??
			row.data?.c.teachers.find((t) => t.userId === row.data?.m.creatorUserId)?.name ??
			row.data?.c.teachers[0]?.name
	);
</script>

{#if m}
	<article class="max-w-4xl">
		<PostHeader
			courseId={m.courseId}
			title={m.title}
			byline={[teacher, formatRelative(m.createdAt)].filter(Boolean).join(' • ')}
			alternateLink={m.alternateLink}
		>
			{#snippet icon()}<MenuBookIcon />{/snippet}
			{#snippet meta()}
				<span>Material</span>
				{#if topicQuery.data}<Badge variant="outline">{topicQuery.data.name}</Badge>{/if}
			{/snippet}
		</PostHeader>
		<div class="mt-6 sm:pl-16">
			{#if m.description}
				<RichText
					text={m.description}
					html={m.html}
					class="max-w-[70ch] text-body-lg text-pretty break-words text-on-surface"
				/>
			{/if}
			{#if m.materials.length}
				<div class="mt-6"><Attachments items={m.materials} /></div>
			{/if}
		</div>
	</article>
{/if}
