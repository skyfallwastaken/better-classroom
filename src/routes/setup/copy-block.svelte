<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.js';
	import { ContentCopy as ContentCopyIcon } from '@material-symbols-svg/svelte/rounded/icons/content-copy';
	import { Check as CheckIcon } from '@material-symbols-svg/svelte/rounded/icons/check';
	import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@material-symbols-svg/svelte/rounded/icons/keyboard-arrow-down';

	let { name, source }: { name: string; source: string } = $props();
	let copied = $state(false);
	let expanded = $state(false);
	const lines = $derived(source.split('\n').length);

	async function copy() {
		await navigator.clipboard.writeText(source);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<div class="overflow-hidden rounded-xl bg-surface-container-high">
	<div class="flex items-center gap-2 bg-surface-container-highest py-1.5 pr-1.5 pl-4">
		<code class="text-xs font-medium">{name}</code>
		<span class="text-xs whitespace-nowrap text-muted-foreground">{lines} lines</span>
		<Button
			variant="ghost"
			size="xs"
			class="ml-auto text-muted-foreground"
			aria-expanded={expanded}
			onclick={() => (expanded = !expanded)}
		>
			<KeyboardArrowDownIcon
				data-icon="inline-start"
				class={`transition-transform ${expanded ? 'rotate-180' : ''}`}
			/>
			{expanded ? 'Hide' : 'Show'}
		</Button>
		<Button variant={copied ? 'secondary' : 'default'} size="xs" onclick={copy}>
			{#if copied}<CheckIcon data-icon="inline-start" />Copied{:else}<ContentCopyIcon
					data-icon="inline-start"
				/>Copy {name}{/if}
		</Button>
	</div>
	{#if expanded}
		<pre class="max-h-72 overflow-auto p-3 text-[11px] leading-4 whitespace-pre"><code
				>{source}</code
			></pre>
	{/if}
</div>
