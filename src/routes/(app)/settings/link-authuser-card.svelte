<script lang="ts">
	import { linkAuthUser, parseAuthUser, setLinkAuthUser } from '#lib/link-authuser.svelte.ts';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import SettingsCard from './settings-card.svelte';
</script>

<SettingsCard>
	<div class="flex flex-wrap items-start justify-between gap-4 px-5 py-4">
		<div>
			<h2 class="text-title-md">Google account for links</h2>
			<p class="mt-1 max-w-prose text-body-md text-pretty text-on-surface-variant">
				Signed into more than one Google account? Enter the number of the one Classroom and Drive
				links should open in: 0 for the first account you signed into, 1 for the next, and so on.
				Saved for this browser only.
			</p>
		</div>
		<div class="flex shrink-0 items-center gap-2">
			<Label for="link-authuser" class="text-on-surface-variant">Account number</Label>
			<Input
				id="link-authuser"
				type="number"
				min="0"
				step="1"
				placeholder="Off"
				value={linkAuthUser.value ?? ''}
				onchange={(e) => setLinkAuthUser(parseAuthUser(e.currentTarget.value))}
				class="w-20"
			/>
		</div>
	</div>
</SettingsCard>
