<script lang="ts">
	import * as ContextMenu from '#lib/components/ui/context-menu/index.js';
	import { setCoursePrefs } from '#lib/api.ts';
	import { setCourseHidden } from '#lib/course-actions.ts';
	import { notify } from '#lib/toast.ts';
	import { withAuthUser } from '#lib/link-authuser.svelte.ts';
	import type { CourseRef as Course } from '#lib/course.ts';
	import type { Snippet } from 'svelte';
	import { Edit as EditIcon } from '@material-symbols-svg/svelte/rounded/icons/edit';
	import { VisibilityOff as VisibilityOffIcon } from '@material-symbols-svg/svelte/rounded/icons/visibility-off';
	import { OpenInNew as OpenInNewIcon } from '@material-symbols-svg/svelte/rounded/icons/open-in-new';
	import { RestartAlt as RestartAltIcon } from '@material-symbols-svg/svelte/rounded/icons/restart-alt';

	let {
		course,
		onRename,
		children
	}: { course: Course; onRename: (course: Course) => void; children: Snippet } = $props();

	const hide = () =>
		setCourseHidden(course, true, 'Find it again under Settings → Hidden courses.');

	async function resetName() {
		const nickname = course.nickname;
		await setCoursePrefs(course.id, { nickname: null });
		notify('sky', `Back to “${course.name}”`, {
			action: { label: 'Undo', onClick: () => setCoursePrefs(course.id, { nickname }) }
		});
	}
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger>
		{@render children()}
	</ContextMenu.Trigger>
	<ContextMenu.Content class="w-52">
		<ContextMenu.Item onSelect={() => onRename(course)}
			><EditIcon />Rename or recolor…</ContextMenu.Item
		>
		{#if course.nickname}
			<ContextMenu.Item onSelect={resetName}><RestartAltIcon />Use original name</ContextMenu.Item>
		{/if}
		<ContextMenu.Item onSelect={hide}><VisibilityOffIcon />Hide course</ContextMenu.Item>
		{#if course.alternateLink}
			<ContextMenu.Separator />
			<ContextMenu.Item
				onSelect={() => window.open(withAuthUser(course.alternateLink), '_blank', 'noreferrer')}
				><OpenInNewIcon />Open in Classroom</ContextMenu.Item
			>
		{/if}
	</ContextMenu.Content>
</ContextMenu.Root>
