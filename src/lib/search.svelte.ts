import type { SearchHit } from '#lib/shared/types.ts';
import { Assignment as AssignmentIcon } from '@material-symbols-svg/svelte/rounded/icons/assignment';
import { MenuBook as MenuBookIcon } from '@material-symbols-svg/svelte/rounded/icons/menu-book';
import { Campaign as CampaignIcon } from '@material-symbols-svg/svelte/rounded/icons/campaign';

export function createSearch(query: () => string, limit: number) {
	let hits = $state<SearchHit[]>([]);
	let loading = $state(false);
	let controller: AbortController | undefined;
	$effect(() => {
		const q = query();
		controller?.abort();
		if (!q) {
			hits = [];
			return;
		}
		const c = (controller = new AbortController());
		loading = true;
		fetch(`/api/search?q=${encodeURIComponent(q)}&limit=${limit}`, { signal: c.signal })
			.then((r) => r.json())
			.then((res: SearchHit[]) => {
				if (!c.signal.aborted) hits = res;
			})
			.catch(() => {})
			.finally(() => {
				if (!c.signal.aborted) loading = false;
			});
	});
	return {
		get hits() {
			return hits;
		},
		get loading() {
			return loading;
		}
	};
}

export const kindIcon = {
	work: AssignmentIcon,
	material: MenuBookIcon,
	announcement: CampaignIcon,
	course: MenuBookIcon
} as const;

export const kindLabel = {
	work: 'Assignment',
	material: 'Material',
	announcement: 'Announcement',
	course: 'Course'
} as const;
