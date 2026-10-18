import { test, expect } from 'bun:test';
import { bucketize, dueLabel } from './todo.ts';
import { summarize, type WorkSummary } from './work.ts';
import type { CourseWork } from './shared/types.ts';
import type { WorkStatus } from './shared/status.ts';

// Thursday 15 October 2026, midday local time; the week runs Mon 12 – Sun 18.
const NOW = new Date(2026, 9, 15, 12).getTime();

/** Classroom stores date-only due dates as 23:59 UTC on that day. */
const dateOnly = (d: number) => Date.UTC(2026, 9, d, 23, 59);

let n = 0;
function work(status: WorkStatus, dueAt?: number, hasDueTime = false): WorkSummary {
	return { id: `w${n++}`, status, dueAt, hasDueTime } as WorkSummary;
}

const ids = (tab: Parameters<typeof bucketize>[0], items: WorkSummary[]) =>
	Object.fromEntries(bucketize(tab, items, NOW).map((b) => [b.id, b.items.map((w) => w.id)]));

test('assigned work splits at Monday boundaries, Sunday staying in its own week', () => {
	const sun = work('assigned', dateOnly(18));
	const mon = work('assigned', dateOnly(19));
	const nextSun = work('assigned', dateOnly(25));
	const later = work('assigned', dateOnly(26));
	const undated = work('assigned');
	expect(ids('assigned', [later, nextSun, mon, sun, undated])).toEqual({
		none: [undated.id],
		'this-week': [sun.id],
		'next-week': [mon.id, nextSun.id],
		later: [later.id]
	});
});

test('missing work counts back from this Monday, most recent first', () => {
	const monMorning = work('missing', new Date(2026, 9, 12, 9).getTime(), true);
	const sun = work('missing', dateOnly(11));
	const lastMon = work('missing', dateOnly(5));
	const older = work('missing', dateOnly(4));
	expect(ids('missing', [older, lastMon, sun, monMorning])).toEqual({
		'this-week': [monMorning.id],
		'last-week': [sun.id, lastMon.id],
		earlier: [older.id]
	});
});

test('done work due in the future is "done early"; open work stays out of the tab', () => {
	const early = work('turnedIn', dateOnly(16));
	const graded = work('graded', dateOnly(14));
	const undated = work('returned');
	const open = work('assigned', dateOnly(16));
	expect(ids('done', [graded, early, undated, open])).toEqual({
		none: [undated.id],
		early: [early.id],
		'this-week': [graded.id],
		'last-week': [],
		earlier: []
	});
});

test('due labels always name a concrete day', () => {
	expect(dueLabel({ dueAt: new Date(2026, 9, 15, 15, 30).getTime(), hasDueTime: true }, NOW)).toBe(
		'Today, 15:30'
	);
	expect(dueLabel({ dueAt: dateOnly(16), hasDueTime: false }, NOW)).toBe('Tomorrow');
	expect(dueLabel({ dueAt: dateOnly(20), hasDueTime: false }, NOW)).toBe('Tuesday 20 Oct');
	expect(dueLabel({ dueAt: undefined, hasDueTime: false }, NOW)).toBe('No due date');
});

test('date-only work stays assigned until its due day ends in local time', () => {
	const due = { dueAt: dateOnly(15), hasDueTime: false } as CourseWork;
	const statusAt = (h: number, d = 15) =>
		summarize(due, undefined, 'Maths', new Date(2026, 9, d, h, 30).getTime()).status;
	expect(statusAt(23)).toBe('assigned');
	expect(statusAt(0, 16)).toBe('missing');
});
