<script lang="ts">
	import { comments as commentsApi, errorMessage } from '#lib/api.ts';
	import type { WorkSummary } from '#lib/work.ts';
	import { notify } from '#lib/toast.ts';
	import { formatRelative } from '#lib/format.ts';
	import { Button } from '#lib/components/ui/button/index.js';
	import RichText from '#lib/components/rich-text.svelte';
	import ConfirmDialog from '#lib/components/confirm-dialog.svelte';
	import type { Comment } from '#lib/shared/types.ts';
	import { ProgressActivity as LoaderIcon } from '@material-symbols-svg/svelte/rounded/icons/progress-activity';
	import { Delete as DeleteIcon } from '@material-symbols-svg/svelte/rounded/icons/delete';
	import { Person as PersonIcon } from '@material-symbols-svg/svelte/rounded/icons/person';
	import { Send as SendIcon } from '@material-symbols-svg/svelte/rounded/icons/send';

	let { work, teacher }: { work: WorkSummary; teacher?: string } = $props();

	const ref = $derived({ courseId: work.courseId, workId: work.id });

	let comments = $state<Comment[] | null>(null);
	let commentsError = $state<string | null>(null);
	let commentDraft = $state('');
	let posting = $state(false);
	let removing = $state<string | null>(null);
	let confirmDelete = $state<string | null>(null);
	let confirmOpen = $state(false);

	async function loadComments() {
		commentsError = null;
		try {
			comments = await commentsApi.list(ref);
		} catch (err) {
			commentsError = errorMessage(err);
			comments = [];
		}
	}

	async function postComment() {
		if (!commentDraft.trim()) return;
		posting = true;
		try {
			await commentsApi.post(ref, commentDraft.trim());
			commentDraft = '';
			await loadComments();
		} catch (err) {
			notify('rose', 'Could not post comment', { description: errorMessage(err) });
		} finally {
			posting = false;
		}
	}

	async function removeComment(id: string) {
		removing = id;
		try {
			await commentsApi.remove(ref, id);
			comments = (comments ?? []).filter((c) => c.id !== id);
		} catch (err) {
			notify('rose', 'Could not delete comment', { description: errorMessage(err) });
		} finally {
			removing = null;
		}
	}

	$effect(() => {
		if (comments === null) void loadComments();
	});
</script>

<h2 class="flex items-center gap-3 text-title-md text-on-surface">
	<PersonIcon class="size-6 text-on-surface-variant" />Private comments
</h2>
{#if commentsError}
	<p class="mt-2 text-body-md text-on-surface-variant">{commentsError}</p>
{:else if comments === null}
	<p class="mt-2 text-body-md text-on-surface-variant">Loading…</p>
{:else if comments.length === 0}
	<p class="mt-2 text-body-md text-on-surface-variant">No comments yet.</p>
{:else}
	<ul role="list" class="mt-3 space-y-3">
		{#each comments as c (c.id)}
			<li class="group text-body-md">
				<div class="flex items-baseline justify-between gap-2">
					<span class="text-title-sm">{c.mine ? 'You' : (c.author?.name ?? 'Teacher')}</span>
					<span class="flex items-center gap-2 text-body-sm text-on-surface-variant">
						{#if c.createdAt}{formatRelative(c.createdAt)}{/if}
						{#if c.mine}
							<Button
								variant="ghost"
								size="icon-sm"
								class="opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive focus-visible:opacity-100 pointer-coarse:opacity-100"
								aria-label="Delete comment"
								disabled={removing === c.id}
								onclick={() => {
									confirmDelete = c.id;
									confirmOpen = true;
								}}
							>
								{#if removing === c.id}<LoaderIcon class="animate-spin" />{:else}<DeleteIcon />{/if}
							</Button>
						{/if}
					</span>
				</div>
				<RichText text={c.text} html={c.html} class="mt-0.5 text-pretty break-words" />
			</li>
		{/each}
	</ul>
{/if}
{#if !commentsError}
	<form
		class="mt-4 flex items-end gap-2"
		onsubmit={(e) => {
			e.preventDefault();
			void postComment();
		}}
	>
		<textarea
			bind:value={commentDraft}
			rows="1"
			placeholder={teacher ? `Add comment to ${teacher}` : 'Add a private comment…'}
			class="field-sizing-content max-h-40 min-h-10 w-full resize-none rounded-[20px] border border-outline bg-transparent px-4 py-2 text-body-md outline-none placeholder:text-on-surface-variant focus-visible:border-primary focus-visible:shadow-[inset_0_0_0_1px_var(--md-primary)]"
		></textarea>
		<Button
			type="submit"
			size="icon"
			variant="ghost"
			class="shrink-0 text-primary"
			aria-label="Post comment"
			disabled={posting || !commentDraft.trim()}
		>
			{#if posting}<LoaderIcon class="animate-spin" />{:else}<SendIcon />{/if}
		</Button>
	</form>
{/if}
<ConfirmDialog
	bind:open={confirmOpen}
	title="Delete comment?"
	description="This can't be undone."
	confirmLabel="Delete"
	onConfirm={() => {
		const id = confirmDelete;
		confirmDelete = null;
		if (id) return removeComment(id);
	}}
/>
