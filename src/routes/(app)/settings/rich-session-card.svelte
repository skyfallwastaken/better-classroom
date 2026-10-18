<script lang="ts">
	import { tick } from 'svelte';
	import type { PageData } from './$types';
	import { notify } from '#lib/toast.ts';
	import { formatRelative } from '#lib/format.ts';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Sync as SyncIcon } from '@material-symbols-svg/svelte/rounded/icons/sync';
	import { Power as PowerIcon } from '@material-symbols-svg/svelte/rounded/icons/power';
	import { ProgressActivity as ProgressActivityIcon } from '@material-symbols-svg/svelte/rounded/icons/progress-activity';
	import { Textarea } from '#lib/components/ui/textarea/index.js';
	import ConfirmDialog from '#lib/components/confirm-dialog.svelte';
	import SettingsCard from './settings-card.svelte';

	let { initial }: { initial: PageData['rich'] } = $props();

	// svelte-ignore state_referenced_locally
	let rich = $state(initial);
	let cookieDraft = $state('');
	let savingCookie = $state(false);
	// svelte-ignore state_referenced_locally
	let cookieOpen = $state(!initial.configured);
	let forgetOpen = $state(false);
	let forgetting = $state(false);
	let cookieField = $state<HTMLTextAreaElement | null>(null);

	async function saveCookie() {
		if (!cookieDraft.trim()) return;
		savingCookie = true;
		try {
			const res = await fetch('/api/rich', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ cookie: cookieDraft })
			});
			const result = (await res.json()) as
				| {
						ok: true;
						authuser: number;
						sample: number;
						savedAt: number;
						status: typeof rich.status;
						keepAlive: typeof rich.keepAlive;
				  }
				| { ok: false; message: string };
			if (result.ok) {
				rich = {
					configured: true,
					savedAt: result.savedAt,
					authuser: result.authuser,
					status: result.status,
					keepAlive: result.keepAlive
				};
				cookieDraft = '';
				cookieOpen = false;
				notify('emerald', 'Classroom session saved', {
					description: `Signed in as account ${result.authuser}. Fetching formatting for every post now.`
				});
			} else
				notify('rose', 'That cookie did not work', {
					description: result.message,
					duration: 12000
				});
		} finally {
			savingCookie = false;
		}
	}
	async function forgetCookie() {
		forgetting = true;
		try {
			const res = await fetch('/api/rich', { method: 'DELETE' });
			if (!res.ok) throw new Error(`Request failed (${res.status})`);
			rich = (await res.json()) as typeof rich;
		} finally {
			forgetting = false;
		}
		cookieOpen = true;
		notify('amber', 'Classroom session removed', {
			description: 'Posts keep the formatting already fetched; new ones stay plain.'
		});
	}
	async function refreshRich() {
		const res = await fetch('/api/rich');
		rich = (await res.json()) as typeof rich;
	}
	const keptAliveAt = $derived(
		Math.max(rich.keepAlive?.rotatedAt ?? 0, rich.keepAlive?.refreshedAt ?? 0) || undefined
	);
</script>

<SettingsCard>
	<div
		class="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant px-5 py-4"
	>
		<div class="flex items-center gap-3">
			<h2 class="text-title-md">Post formatting</h2>
			{#if !rich.configured}<Badge variant="outline">Off</Badge>
			{:else if rich.status && !rich.status.ok}<Badge variant="destructive"
					>{rich.status.expired ? 'Session expired' : 'Error'}</Badge
				>
			{:else}<Badge variant="outline" class="text-success">On</Badge>{/if}
		</div>
		{#if rich.configured}
			<div class="flex items-center gap-2">
				<Button variant="outline" size="sm" onclick={refreshRich}>
					<SyncIcon data-icon="inline-start" />Refresh
				</Button>
				<Button
					variant="outline"
					size="sm"
					onclick={async () => {
						cookieOpen = true;
						await tick();
						cookieField?.focus();
					}}
				>
					Replace cookie
				</Button>
				<Button
					variant="outline"
					size="sm"
					disabled={forgetting}
					onclick={() => (forgetOpen = true)}
				>
					{#if forgetting}<ProgressActivityIcon
							data-icon="inline-start"
							class="animate-spin"
						/>{/if}Forget
				</Button>
			</div>
		{/if}
	</div>
	<div class="space-y-3 px-5 py-4 text-body-md">
		<p class="max-w-prose text-pretty text-on-surface-variant">
			The Classroom API strips bold, underline and lists from posts. With a signed-in Classroom
			session the app can read the formatted version the web app uses. The cookie stays in the local
			database and is only ever sent to classroom.google.com.
		</p>
		{#if rich.configured}
			<dl class="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
				<div>
					<dt class="text-on-surface-variant">Cookie saved</dt>
					<dd class="mt-1 text-title-sm tabular-nums">
						{rich.savedAt ? formatRelative(rich.savedAt) : '–'}
					</dd>
				</div>
				<div>
					<dt class="text-on-surface-variant">Kept alive</dt>
					<dd class="mt-1 text-title-sm tabular-nums">
						{keptAliveAt ? formatRelative(keptAliveAt) : '–'}
					</dd>
				</div>
				<div>
					<dt class="text-on-surface-variant">Account slot</dt>
					<dd class="mt-1 text-title-sm tabular-nums">/u/{rich.authuser ?? 0}/</dd>
				</div>
				<div>
					<dt class="text-on-surface-variant">Last run</dt>
					<dd class="mt-1 text-title-sm tabular-nums">
						{rich.status ? formatRelative(rich.status.at) : '–'}
					</dd>
				</div>
				<div>
					<dt class="text-on-surface-variant">Posts updated</dt>
					<dd class="mt-1 text-title-sm tabular-nums">{rich.status?.updated ?? 0}</dd>
				</div>
			</dl>
			{#if rich.status && !rich.status.ok}
				<p class="rounded-md bg-error-container px-4 py-3 text-body-md text-on-error-container">
					{rich.status.message}
				</p>
			{/if}
		{/if}
		{#if cookieOpen}
			<ol class="max-w-prose list-decimal space-y-1 pl-5 text-on-surface-variant">
				<li>
					Open classroom.google.com in a browser profile you use for nothing else, signed in with
					your school account. Google rotates the session cookie from any open Google tab, and two
					rotators on one session get the whole account signed out, so this profile must stay closed
					once the cookie is copied.
				</li>
				<li>
					Open DevTools → Network, reload, click the first <span class="font-mono"
						>classroom.google.com</span
					> request.
				</li>
				<li>
					Under Request Headers copy the whole <span class="font-mono">Cookie</span> value and paste it
					below.
				</li>
			</ol>
			<Textarea
				bind:ref={cookieField}
				bind:value={cookieDraft}
				rows={4}
				spellcheck="false"
				aria-label="Classroom cookie"
				placeholder="SID=…; HSID=…; SSID=…; APISID=…; SAPISID=…; …"
				class="field-sizing-fixed font-mono text-body-sm md:text-body-sm"
			/>
			<div class="flex flex-wrap items-center gap-2">
				<Button size="sm" onclick={saveCookie} disabled={savingCookie || !cookieDraft.trim()}>
					{#if savingCookie}<ProgressActivityIcon
							data-icon="inline-start"
							class="animate-spin"
						/>{:else}<PowerIcon data-icon="inline-start" />{/if}Save and test
				</Button>
				{#if rich.configured}
					<Button
						variant="outline"
						size="sm"
						onclick={() => ((cookieOpen = false), (cookieDraft = ''))}>Cancel</Button
					>
				{/if}
				<span class="text-body-sm text-on-surface-variant"
					>The app keeps the session alive itself. Paste a fresh one when the badge says expired.</span
				>
			</div>
		{/if}
	</div>
</SettingsCard>

<ConfirmDialog
	bind:open={forgetOpen}
	title="Forget Classroom session?"
	description="The saved cookie is deleted. Comments and rich formatting on new posts stop working until you paste a new cookie. Posts keep the formatting already fetched."
	confirmLabel="Forget"
	onConfirm={forgetCookie}
/>
