<script lang="ts">
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import { setCoursePrefs } from '#lib/api.ts';
	import type { CourseRef as Course } from '#lib/course.ts';
	import { courseColorName } from '#lib/course-colors.svelte.ts';
	import { COLOR_NAMES, hashedColor, type ColorName } from '#lib/shared/colors.ts';
	import { Check as CheckIcon } from '@material-symbols-svg/svelte/rounded/icons/check';

	let { course = $bindable(null) }: { course?: Course | null } = $props();
	let value = $state('');
	let color = $state<ColorName>('emerald');
	let saving = $state(false);
	$effect(() => {
		if (course) {
			value = course.nickname ?? course.name;
			color = courseColorName(course.id);
		}
	});

	async function save(e: SubmitEvent) {
		e.preventDefault();
		if (!course) return;
		saving = true;
		try {
			const trimmed = value.trim();
			await setCoursePrefs(course.id, {
				nickname: trimmed && trimmed !== course.name ? trimmed : null,
				color: color === hashedColor(course.id) ? null : color
			});
			course = null;
		} finally {
			saving = false;
		}
	}
</script>

<Dialog.Root open={course !== null} onOpenChange={(open) => !open && (course = null)}>
	<Dialog.Content class="sm:max-w-sm">
		<Dialog.Header>
			<Dialog.Title>Edit course</Dialog.Title>
			<Dialog.Description
				>Only changes how it appears here. Classroom keeps “{course?.name}”.</Dialog.Description
			>
		</Dialog.Header>
		<form onsubmit={save} class="grid gap-4">
			<div class="grid gap-2">
				<Label for="course-nickname">Nickname</Label>
				<Input
					id="course-nickname"
					name="nickname"
					bind:value
					maxlength={80}
					autofocus
					class="max-sm:text-base/6"
				/>
			</div>
			<fieldset class="grid gap-2">
				<legend class="text-title-sm">Color</legend>
				<div class="flex flex-wrap gap-2">
					{#each COLOR_NAMES as name (name)}
						<button
							type="button"
							aria-label={name}
							aria-pressed={color === name}
							onclick={() => (color = name)}
							data-course-color={name}
							class="flex size-10 items-center justify-center rounded-full bg-course text-on-course transition-[border-radius,transform] duration-300 ease-spring hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-pressed:rounded-md"
						>
							{#if color === name}<CheckIcon class="size-4" />{/if}
						</button>
					{/each}
				</div>
			</fieldset>
			<Dialog.Footer>
				<Button type="button" variant="outline" onclick={() => (course = null)}>Cancel</Button>
				<Button type="submit" disabled={saving}>Save</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
