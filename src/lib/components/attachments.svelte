<script lang="ts">
	import * as Item from '#lib/components/ui/item/index.js';
	import { avatarUrl } from '#lib/api.ts';
	import { withAuthUser } from '#lib/link-authuser.svelte.ts';
	import type { Attachment } from '#lib/shared/types.ts';
	import { cn } from '#lib/utils.js';
	import { Description as DescriptionIcon } from '@material-symbols-svg/svelte/rounded/icons/description';
	import { PlayCircle as PlayCircleIcon } from '@material-symbols-svg/svelte/rounded/icons/play-circle';
	import { Link as LinkIcon } from '@material-symbols-svg/svelte/rounded/icons/link';
	import { EditDocument as EditDocumentIcon } from '@material-symbols-svg/svelte/rounded/icons/edit-document';
	import { OpenInNew as OpenInNewIcon } from '@material-symbols-svg/svelte/rounded/icons/open-in-new';

	let { items, class: className }: { items: Attachment[]; class?: string } = $props();

	const icons = {
		drive: DescriptionIcon,
		youtube: PlayCircleIcon,
		link: LinkIcon,
		form: EditDocumentIcon
	} as const;
	const labels = { drive: 'Drive file', youtube: 'YouTube', link: 'Link', form: 'Form' } as const;
	const iconFor = (t: string) => icons[t as keyof typeof icons] ?? LinkIcon;
	const labelFor = (t: string) => labels[t as keyof typeof labels] ?? 'Attachment';
	const proxied = (url: string | undefined) =>
		url && /^https:\/\/lh\d\.googleusercontent\.com\//.test(url) ? avatarUrl(url) : undefined;
	let failed = $state(new Set<string>());
</script>

<Item.Group class={cn('grid gap-3 sm:grid-cols-2', className)}>
	{#each items as a, i (a.url ?? i)}
		{@const Icon = iconFor(a.type)}
		{@const thumb = proxied(a.thumbnailUrl)}
		<Item.Root variant="outline" size="sm" class="min-h-0 gap-3 overflow-hidden py-0 pl-0">
			{#snippet child({ props })}
				<a href={withAuthUser(a.url)} target="_blank" rel="noreferrer" {...props}>
					{#if thumb && !failed.has(thumb)}
						<Item.Media variant="image" class="h-16 w-20 rounded-none bg-surface-container-high">
							<img
								src={thumb}
								alt=""
								loading="lazy"
								onerror={() => (failed = new Set([...failed, thumb]))}
							/>
						</Item.Media>
					{:else}
						<Item.Media
							variant="icon"
							class="h-16 w-20 rounded-none bg-surface-container-high text-on-surface-variant [&_svg]:size-7!"
							><Icon /></Item.Media
						>
					{/if}
					<Item.Content class="min-w-0">
						<Item.Title class="block w-full truncate text-title-sm text-on-surface"
							>{a.title || a.url}</Item.Title
						>
						<Item.Description>{labelFor(a.type)}</Item.Description>
					</Item.Content>
					<Item.Actions><OpenInNewIcon class="size-5" /></Item.Actions>
				</a>
			{/snippet}
		</Item.Root>
	{/each}
</Item.Group>
