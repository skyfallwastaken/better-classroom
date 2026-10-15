<script lang="ts">
	import type { Snippet } from 'svelte';
	import CourseAvatar from '#lib/components/course-avatar.svelte';
	import * as DropdownMenu from '#lib/components/ui/dropdown-menu/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { withAuthUser } from '#lib/link-authuser.svelte.ts';
	import { notify } from '#lib/toast.ts';
	import { MoreVert as MoreVertIcon } from '@material-symbols-svg/svelte/rounded/icons/more-vert';
	import { OpenInNew as OpenInNewIcon } from '@material-symbols-svg/svelte/rounded/icons/open-in-new';
	import { Link as LinkIcon } from '@material-symbols-svg/svelte/rounded/icons/link';

	/** Classroom's post header: tonal icon, title, "Teacher • date", then a meta row and a divider. */
	let {
		courseId,
		title,
		byline,
		alternateLink,
		icon,
		meta
	}: {
		courseId: string;
		title: string;
		byline: string;
		alternateLink?: string;
		icon: Snippet;
		meta?: Snippet;
	} = $props();

	async function copyLink() {
		await navigator.clipboard.writeText(location.href);
		notify('sky', 'Link copied');
	}
</script>

<header class="flex gap-4">
	<CourseAvatar id={courseId} class="size-12 max-sm:hidden">{@render icon()}</CourseAvatar>
	<div class="min-w-0 flex-1">
		<div class="flex items-start gap-2">
			<h1 class="min-w-0 flex-1 text-headline-lg text-balance text-on-surface sm:text-display-sm">
				{title}
			</h1>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button variant="ghost" size="icon" aria-label="More options" {...props}
							><MoreVertIcon /></Button
						>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end" class="w-56">
					{#if alternateLink}
						<DropdownMenu.Item
							onSelect={() => window.open(withAuthUser(alternateLink), '_blank', 'noreferrer')}
							><OpenInNewIcon />Open in Classroom</DropdownMenu.Item
						>
					{/if}
					<DropdownMenu.Item onSelect={copyLink}><LinkIcon />Copy link</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
		<p class="mt-2 text-body-md text-on-surface-variant">{byline}</p>
		{#if meta}
			<div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-title-sm text-on-surface">
				{@render meta()}
			</div>
		{/if}
		<div class="mt-4 h-px bg-outline-variant"></div>
	</div>
</header>
