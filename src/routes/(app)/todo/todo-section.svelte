<script lang="ts">
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import CourseAvatar from '#lib/components/course-avatar.svelte';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { dueLabel, type Bucket, type TodoTab } from '#lib/todo.ts';
	import { isNew, type WorkSummary } from '#lib/work.ts';
	import type { Selection } from '#lib/selection.svelte.ts';
	import { Assignment as AssignmentIcon } from '@material-symbols-svg/svelte/rounded/icons/assignment';
	import { Help as QuestionIcon } from '@material-symbols-svg/svelte/rounded/icons/help';
	import { Check as CheckIcon } from '@material-symbols-svg/svelte/rounded/icons/check';
	import { KeyboardArrowDown as ChevronIcon } from '@material-symbols-svg/svelte/rounded/icons/keyboard-arrow-down';

	let {
		tab,
		bucket,
		open = $bindable(false),
		selection,
		indexOf
	}: {
		tab: TodoTab;
		bucket: Bucket;
		open?: boolean;
		selection: Selection;
		/** Position of a row in the whole tab, for shift-click range selection. */
		indexOf: (id: string) => number;
	} = $props();

	const count = $derived(bucket.items.length);

	function status(w: WorkSummary): { text: string; tone: string } {
		if (tab === 'assigned') return { text: dueLabel(w), tone: 'text-success' };
		if (tab === 'missing') return { text: dueLabel(w), tone: 'text-error' };
		if (w.status === 'graded' && w.assignedGrade !== undefined)
			return {
				text: w.maxPoints ? `${w.assignedGrade}/${w.maxPoints}` : String(w.assignedGrade),
				tone: 'font-medium text-on-surface'
			};
		if (w.status === 'returned') return { text: 'Returned', tone: 'text-on-surface-variant' };
		return {
			text: w.late ? 'Done late' : 'Turned in',
			tone: w.late ? 'text-warning' : 'text-on-surface-variant'
		};
	}
</script>

<section>
	<button
		type="button"
		class="state-layer flex h-12 w-full items-center gap-4 rounded-2xl px-4 text-left transition-[border-radius] duration-300 ease-spring-gentle active:rounded-lg disabled:cursor-default disabled:before:hidden"
		aria-expanded={open}
		disabled={count === 0}
		onclick={() => (open = !open)}
	>
		<h2 class="flex-1 text-title-lg text-on-surface">{bucket.label}</h2>
		<span class="text-title-md text-on-surface-variant tabular-nums">{count}</span>
		<ChevronIcon
			class="size-6 text-on-surface-variant transition-transform duration-500 ease-spring {open
				? 'rotate-180'
				: ''} {count ? '' : 'opacity-40'}"
		/>
	</button>

	{#if open && count}
		<!-- M3 Expressive segmented list: big outer corners, small inner ones, 2px gaps -->
		<ul
			role="list"
			class="mt-1 mb-3 segmented"
			transition:slide={{ duration: 300, easing: cubicOut }}
		>
			{#each bucket.items as w (w.id)}
				{@const s = status(w)}
				{@const selected = selection.has(w.id)}
				<li
					class="group/row relative transition-[border-radius] duration-300 ease-spring-gentle hover:rounded-xl"
				>
					<a
						href={`/courses/${w.courseId}/work/${w.id}`}
						class="state-layer flex min-h-18 items-center gap-4 rounded-[inherit] px-4 py-3 transition-[background-color] duration-300 ease-spring-gentle {selected
							? 'bg-secondary-container text-on-secondary-container'
							: ''}"
					>
						<CourseAvatar id={w.courseId}>
							{#if w.workType.endsWith('QUESTION')}<QuestionIcon />{:else}<AssignmentIcon />{/if}
						</CourseAvatar>
						<span class="min-w-0 flex-1">
							<span class="flex items-center gap-2">
								<span class="truncate text-title-sm">{w.title}</span>
								{#if isNew(w)}<Badge variant="secondary" class="h-5 shrink-0">New</Badge>{/if}
							</span>
							<span class="block truncate text-body-md text-on-surface-variant">{w.courseName}</span
							>
						</span>
						<span class="shrink-0 text-right text-body-md tabular-nums {s.tone}">{s.text}</span>
					</a>
					<!-- Like Gmail: the avatar turns into a checkbox on hover or once anything is selected.
					     On touch (coarse pointer) it stays transparent but tappable, so tapping the avatar starts a selection. -->
					<button
						type="button"
						role="checkbox"
						aria-checked={selected}
						aria-label={`Select ${w.title}`}
						class="absolute top-1/2 left-4 flex size-10 -translate-y-1/2 items-center justify-center rounded-full transition-[opacity,border-radius,background-color] duration-300 ease-spring focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-primary {selected
							? 'rounded-xl bg-primary text-on-primary opacity-100'
							: `bg-surface-container-highest text-on-surface-variant ${selection.size ? 'opacity-100' : 'pointer-events-none opacity-0 group-hover/row:pointer-events-auto group-hover/row:opacity-100 focus-visible:pointer-events-auto pointer-coarse:pointer-events-auto'}`}"
						onclick={(e) => selection.toggle(indexOf(w.id), e.shiftKey)}
					>
						{#if selected}<CheckIcon class="size-6" />{:else}<span
								class="size-[18px] rounded-[2px] border-2 border-current"
							></span>{/if}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</section>
