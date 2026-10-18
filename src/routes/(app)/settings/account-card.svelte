<script lang="ts">
	import { page } from '$app/state';
	import { authClient } from '#lib/auth-client.ts';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Logout as LogoutIcon } from '@material-symbols-svg/svelte/rounded/icons/logout';
	import SettingsCard from './settings-card.svelte';

	let signingOut = $state(false);
	async function signOut() {
		signingOut = true;
		await authClient.signOut();
		window.location.assign('/login');
	}
</script>

<SettingsCard class="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
	<div class="min-w-0">
		<h2 class="text-title-md">Account</h2>
		<p class="truncate text-body-md text-on-surface-variant">
			Signed in as {page.data.user?.name || page.data.user?.email}
			{#if page.data.user?.name}<span>· {page.data.user.email}</span>{/if}
		</p>
	</div>
	<Button variant="outline" size="sm" onclick={signOut} disabled={signingOut}>
		<LogoutIcon data-icon="inline-start" />Sign out
	</Button>
</SettingsCard>
