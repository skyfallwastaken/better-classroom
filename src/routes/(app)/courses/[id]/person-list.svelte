<script lang="ts">
	import UserAvatar from '#lib/components/user-avatar.svelte';

	type Person = { userId?: string; name?: string; email?: string; photoUrl?: string };
	let { people, variant }: { people: Person[]; variant: 'teacher' | 'student' } = $props();

	const teacher = $derived(variant === 'teacher');
</script>

<ul role="list" class="mt-2 divide-y divide-outline-variant">
	{#each people as p, i (teacher ? p.userId : (p.email ?? `${p.name}#${i}`))}
		<li class="flex items-center gap-4 px-4 py-2">
			<UserAvatar src={p.photoUrl} name={p.name} class="size-10" />
			<div class="min-w-0">
				<p class="truncate text-title-sm text-on-surface">
					{p.name ?? (teacher ? 'Teacher' : 'Classmate')}
				</p>
				{#if p.email}<a
						href={`mailto:${p.email}`}
						class="block truncate text-body-md text-on-surface-variant hover:text-on-surface"
						>{p.email}</a
					>{/if}
			</div>
		</li>
	{/each}
</ul>
