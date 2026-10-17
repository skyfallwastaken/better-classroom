export type WorkStatus = 'graded' | 'returned' | 'turnedIn' | 'missing' | 'assigned';

type Due = { dueAt?: number; hasDueTime: boolean };

/**
 * Whether the deadline has passed. Classroom stores a date-only due date as 23:59 UTC on that
 * day, but the work is due until that date ends where the student is, not at 23:59 UTC.
 */
export function pastDue({ dueAt, hasDueTime }: Due, now: number) {
	if (dueAt === undefined) return false;
	if (hasDueTime) return dueAt < now;
	const d = new Date(dueAt);
	return now >= new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1).getTime();
}

export function workStatus(
	sub: { state: string; assignedGrade?: number; late?: boolean } | null | undefined,
	due: Due,
	now: number
): WorkStatus {
	if (sub) {
		if (sub.assignedGrade !== undefined) return 'graded';
		if (sub.state === 'RETURNED') return 'returned';
		if (sub.state === 'TURNED_IN') return 'turnedIn';
	}
	if (pastDue(due, now)) return 'missing';
	return 'assigned';
}
