<script lang="ts">
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { errorMessage } from '#lib/api.ts';
	import { notify } from '#lib/toast.ts';

	/** Asks before a destructive action that can't be undone. Cancel is the default choice. */
	let {
		open = $bindable(false),
		title,
		description,
		confirmLabel,
		onConfirm
	}: {
		open?: boolean;
		title: string;
		description: string;
		confirmLabel: string;
		onConfirm: () => void | Promise<void>;
	} = $props();

	// Close first: the caller shows progress on the row itself, and its state is free for the next prompt.
	async function confirm() {
		if (!open) return; // a second click while the dialog animates out
		open = false;
		try {
			await onConfirm();
		} catch (err) {
			notify('rose', `Couldn't ${confirmLabel.toLowerCase()}`, { description: errorMessage(err) });
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-sm" showCloseButton={false}>
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
			<Dialog.Description>{description}</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (open = false)}>Cancel</Button>
			<Button variant="destructive" onclick={confirm}>{confirmLabel}</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
