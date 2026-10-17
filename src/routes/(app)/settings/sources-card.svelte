<script lang="ts">
	import { Badge } from '#lib/components/ui/badge/index.js';
	import type { ProviderStatus } from '#lib/shared/types.ts';
	import SettingsCard from './settings-card.svelte';

	let { providers }: { providers: ProviderStatus[] } = $props();
</script>

<SettingsCard>
	<div class="border-b border-outline-variant px-5 py-4">
		<h2 class="text-title-md">Sources</h2>
	</div>
	<ul role="list" class="divide-y divide-outline-variant text-body-md">
		{#each providers as provider (provider.id)}
			<li class="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3">
				<span class="w-40 text-title-sm">{provider.label}</span>
				{#if provider.state === 'off'}<Badge variant="outline">Off</Badge>
				{:else if provider.state === 'expired'}<Badge variant="destructive">Expired</Badge>
				{:else if provider.state === 'error'}<Badge variant="destructive">Error</Badge>
				{:else if provider.active}<Badge variant="outline" class="text-success"
						>{provider.role === 'records' ? 'Primary' : 'On'}</Badge
					>
				{:else}<Badge variant="secondary">Standby</Badge>{/if}
				<span class="min-w-0 flex-1 truncate text-on-surface-variant" title={provider.detail}
					>{provider.detail}</span
				>
			</li>
		{/each}
	</ul>
</SettingsCard>
