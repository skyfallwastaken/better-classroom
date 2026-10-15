<script lang="ts">
	import { errorMessage, submissionFiles } from '#lib/api.ts';
	import { isOpen, type WorkSummary } from '#lib/work.ts';
	import { notify } from '#lib/toast.ts';
	import { withAuthUser } from '#lib/link-authuser.svelte.ts';
	import Attachments from '#lib/components/attachments.svelte';
	import type { Attachment, SubmissionFile } from '#lib/shared/types.ts';
	import { buttonVariants } from '#lib/components/ui/button/index.js';
	import { ProgressActivity as LoaderIcon } from '@material-symbols-svg/svelte/rounded/icons/progress-activity';
	import { AttachFile as AttachFileIcon } from '@material-symbols-svg/svelte/rounded/icons/attach-file';
	import { Add as AddIcon } from '@material-symbols-svg/svelte/rounded/icons/add';
	import { Close as CloseIcon } from '@material-symbols-svg/svelte/rounded/icons/close';

	let { work, fallback }: { work: WorkSummary; fallback: Attachment[] } = $props();

	const ref = $derived({ courseId: work.courseId, workId: work.id });

	let files = $state<SubmissionFile[] | null>(null);
	let filesError = $state<string | null>(null);
	let uploading = $state(false);
	let removingFile = $state<string | null>(null);

	async function loadFiles() {
		filesError = null;
		try {
			files = await submissionFiles.list(ref);
		} catch (err) {
			filesError = errorMessage(err);
			files = [];
		}
	}

	async function uploadFile(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		input.value = '';
		if (!file) return;
		uploading = true;
		try {
			files = await submissionFiles.upload(ref, file);
			notify('emerald', 'File attached', { description: file.name });
		} catch (err) {
			notify('rose', 'Could not attach file', { description: errorMessage(err), duration: 10000 });
		} finally {
			uploading = false;
		}
	}

	async function removeFile(driveId: string) {
		removingFile = driveId;
		try {
			files = await submissionFiles.remove(ref, driveId);
		} catch (err) {
			notify('rose', 'Could not remove file', { description: errorMessage(err) });
		} finally {
			removingFile = null;
		}
	}

	$effect(() => {
		if (files === null) void loadFiles();
	});
</script>

{#if filesError}
	{#if fallback.length}
		<Attachments items={fallback} class="sm:grid-cols-1" />
	{:else}
		<p class="text-body-md text-on-surface-variant">Nothing attached yet.</p>
	{/if}
{:else if files === null}
	<p class="text-body-md text-on-surface-variant">Loading files…</p>
{:else}
	{#if files.length}
		<ul role="list" class="mb-3 space-y-2 text-body-md">
			{#each files as f (f.driveId)}
				<li
					class="group flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-low py-2 pr-2 pl-3"
				>
					<AttachFileIcon class="size-5 shrink-0 text-on-surface-variant" />
					<a
						href={withAuthUser(f.url ?? `https://drive.google.com/file/d/${f.driveId}/view`)}
						target="_blank"
						rel="noreferrer"
						class="min-w-0 flex-1 truncate underline-offset-2 hover:underline"
						>{f.title ?? f.driveId}</a
					>
					{#if isOpen(work)}
						<button
							type="button"
							class="state-layer flex size-8 items-center justify-center rounded-full text-on-surface-variant hover:text-error disabled:opacity-50"
							aria-label="Remove file"
							disabled={removingFile === f.driveId}
							onclick={() => removeFile(f.driveId)}
						>
							{#if removingFile === f.driveId}<LoaderIcon
									class="size-4 animate-spin"
								/>{:else}<CloseIcon class="size-5" />{/if}
						</button>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
	{#if isOpen(work)}
		<label
			class="{buttonVariants({
				variant: 'outline'
			})} w-full cursor-pointer text-primary has-focus-visible:outline-2 has-focus-visible:outline-primary"
		>
			{#if uploading}<LoaderIcon data-icon="inline-start" class="animate-spin" />{:else}<AddIcon
					data-icon="inline-start"
				/>{/if}
			{uploading ? 'Uploading…' : 'Add or create'}
			<input type="file" class="sr-only" disabled={uploading} onchange={uploadFile} />
		</label>
	{/if}
{/if}
