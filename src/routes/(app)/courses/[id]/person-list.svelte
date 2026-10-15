<script lang="ts">
	import UserAvatar from '#lib/components/user-avatar.svelte';

	type Person = { userId?: string; name?: string; email?: string; photoUrl?: string };
	let { people, variant }: { people: Person[]; variant: 'teacher' | 'student' } = $props();

	const teacher = $derived(variant === 'teacher');
</script>

<ul role="list" class="mt-2 divide-y divide-outline-variant/60">
	{#each people as p, i (teacher ? p.userId : (p.email ?? `${p.name}#${i}`))}
		<li class="flex items-center gap-3 {teacher ? 'py-3' : 'py-2.5'}">
			<UserAvatar
				src={p.photoUrl}
				name={p.name}
				class={teacher ? 'size-10' : 'size-8'}
				fallbackClass={teacher ? '' : 'text-xs'}
			/>
			<div class="min-w-0">
				{#if teacher}
					<p class="text-title-md">{p.name ?? 'Teacher'}</p>
				{:else}
					<p class="truncate text-sm font-medium">{p.name}</p>
				{/if}
				{#if p.email}<a
						href={`mailto:${p.email}`}
						class="{teacher ? 'text-sm' : 'text-xs'} text-muted-foreground hover:text-foreground"
						>{p.email}</a
					>{/if}
			</div>
		</li>
	{/each}
</ul>
