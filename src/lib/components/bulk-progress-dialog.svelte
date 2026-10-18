<script lang="ts">
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Progress } from '#lib/components/ui/progress/index.js';
	import { pluralize } from '#lib/text.ts';
	import type { Progress as ItemProgress } from '#lib/submissions.ts';
	import { Check as CheckIcon } from '@material-symbols-svg/svelte/rounded/icons/check';
	import { Close as CloseIcon } from '@material-symbols-svg/svelte/rounded/icons/close';
	import { ProgressActivity as ProgressActivityIcon } from '@material-symbols-svg/svelte/rounded/icons/progress-activity';

	let {
		open = $bindable(false),
		title,
		items
	}: { open?: boolean; title: string; items: ItemProgress[] } = $props();

	const finished = $derived(items.filter((p) => p.state === 'done' || p.state === 'failed'));
	const failed = $derived(items.filter((p) => p.state === 'failed'));
	const busy = $derived(finished.length < items.length);
	const summary = $derived(
		busy
			? `${finished.length} of ${items.length} finished`
			: failed.length
				? `${pluralize(items.length - failed.length, 'item')} done, ${failed.length} failed`
				: `All ${items.length} done`
	);
</script>

<Dialog.Root bind:open onOpenChange={(v) => (busy ? (open = true) : (open = v))}>
	<Dialog.Content showCloseButton={!busy} interactOutsideBehavior={busy ? 'ignore' : 'close'}>
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
			<Dialog.Description>{summary}</Dialog.Description>
		</Dialog.Header>
		<Progress value={items.length ? (finished.length / items.length) * 100 : 0} />
		<ul role="list" class="-mx-1 max-h-64 overflow-y-auto text-body-md">
			{#each items as item (item.id)}
				<li class="flex items-start gap-2 rounded-md px-1 py-1">
					<span class="grid size-5 shrink-0 place-content-center">
						{#if item.state === 'done'}<CheckIcon class="size-5 text-success" />
						{:else if item.state === 'failed'}<CloseIcon class="size-5 text-error" />
						{:else if item.state === 'running'}<ProgressActivityIcon
								class="size-5 animate-spin text-on-surface-variant"
							/>
						{:else}<span class="size-1.5 rounded-full bg-on-surface-variant/38"></span>{/if}
					</span>
					<span class="min-w-0 flex-1">
						<span class="line-clamp-1 {item.state === 'pending' ? 'text-on-surface-variant' : ''}"
							>{item.title}</span
						>
						{#if item.error}<span class="line-clamp-2 text-body-sm text-error">{item.error}</span
							>{/if}
					</span>
				</li>
			{/each}
		</ul>
		{#if !busy}
			<Dialog.Footer>
				<Button variant="ghost" class="text-primary" onclick={() => (open = false)}>Close</Button>
			</Dialog.Footer>
		{/if}
	</Dialog.Content>
</Dialog.Root>
