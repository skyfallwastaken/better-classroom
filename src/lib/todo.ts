import { dueDayStart, formatDate, formatTime, startOfDay } from '#lib/format.ts';
import { isOpen, type WorkSummary } from '#lib/work.ts';

/** The three tabs of Classroom's To-do page. */
export type TodoTab = 'assigned' | 'missing' | 'done';

export type Bucket = { id: string; label: string; items: WorkSummary[] };

const DAY = 86_400_000;

/** Monday 00:00 of the week containing `t` (weeks start on Monday in en-GB). */
export function weekStartOf(t: number) {
	const day = startOfDay(t);
	return startOfDay(day - ((new Date(day).getDay() + 6) % 7) * DAY + DAY / 2);
}

export function inTab(tab: TodoTab, w: WorkSummary) {
	if (tab === 'missing') return w.status === 'missing';
	if (tab === 'done') return !isOpen(w);
	return w.status === 'assigned';
}

const LABELS: Record<string, string> = {
	none: 'No due date',
	early: 'Done early',
	'this-week': 'This week',
	'next-week': 'Next week',
	later: 'Later',
	'last-week': 'Last week',
	earlier: 'Earlier'
};

const ORDER: Record<TodoTab, string[]> = {
	assigned: ['none', 'this-week', 'next-week', 'later'],
	missing: ['this-week', 'last-week', 'earlier'],
	done: ['none', 'early', 'this-week', 'last-week', 'earlier']
};

function bucketOf(tab: TodoTab, w: WorkSummary, now: number): string {
	if (w.dueAt === undefined) return tab === 'missing' ? 'earlier' : 'none';
	const thisWeek = weekStartOf(now);
	// Step by days from a midday anchor so a DST change cannot shift the boundary.
	const nextWeek = weekStartOf(thisWeek + 7 * DAY + DAY / 2);
	const weekAfter = weekStartOf(nextWeek + 7 * DAY + DAY / 2);
	const lastWeek = weekStartOf(thisWeek - 7 * DAY + DAY / 2);
	const day = dueDayStart(w.dueAt, w.hasDueTime);
	if (tab === 'assigned')
		return day < nextWeek ? 'this-week' : day < weekAfter ? 'next-week' : 'later';
	// A date-only due date lasts until the end of that day.
	if (tab === 'done' && (w.hasDueTime ? w.dueAt > now : day >= startOfDay(now))) return 'early';
	return day >= thisWeek ? 'this-week' : day >= lastWeek ? 'last-week' : 'earlier';
}

/**
 * Splits one tab's work into Classroom's date groups, keeping empty groups so
 * their zero counts still show. Upcoming work runs soonest first; past work
 * runs most recent first.
 */
export function bucketize(tab: TodoTab, work: WorkSummary[], now = Date.now()): Bucket[] {
	const groups = new Map(ORDER[tab].map((id) => [id, [] as WorkSummary[]]));
	for (const w of work) if (inTab(tab, w)) groups.get(bucketOf(tab, w, now))!.push(w);
	const asc = (a: WorkSummary, b: WorkSummary) => (a.dueAt ?? 0) - (b.dueAt ?? 0);
	return ORDER[tab].map((id) => {
		const items = groups.get(id)!;
		items.sort(tab === 'assigned' || id === 'early' ? asc : (a, b) => asc(b, a));
		return { id, label: LABELS[id], items };
	});
}

/** "Today, 15:30", "Tomorrow" or "Tuesday 20 Oct": always a concrete day, like Classroom. */
export function dueLabel(w: Pick<WorkSummary, 'dueAt' | 'hasDueTime'>, now = Date.now()) {
	if (w.dueAt === undefined) return 'No due date';
	const diff = Math.round((dueDayStart(w.dueAt, w.hasDueTime) - startOfDay(now)) / DAY);
	const day =
		diff === 0
			? 'Today'
			: diff === 1
				? 'Tomorrow'
				: diff === -1
					? 'Yesterday'
					: formatDate(
							w.dueAt,
							{ weekday: 'long', day: 'numeric', month: 'short' },
							!w.hasDueTime,
							now
						);
	return w.hasDueTime ? `${day}, ${formatTime(w.dueAt)}` : day;
}
