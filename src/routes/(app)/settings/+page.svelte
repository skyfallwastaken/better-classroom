<script lang="ts">
	import { page } from '$app/state';
	import { setSearchParam } from '#lib/navigation.ts';
	import * as Tabs from '#lib/components/ui/tabs/index.js';
	import PageHeader from '#lib/components/page-header.svelte';
	import AccountCard from './account-card.svelte';
	import SourcesCard from './sources-card.svelte';
	import SyncCard from './sync-card.svelte';
	import RichSessionCard from './rich-session-card.svelte';
	import LinkAuthUserCard from './link-authuser-card.svelte';
	import ThemePicker from './theme-picker.svelte';
	import CourseVisibility from './course-visibility.svelte';
	import NotificationsCard from './notifications-card.svelte';
	import ShortcutsTable from './shortcuts-table.svelte';

	let { data } = $props();

	const TABS = ['connection', 'appearance', 'courses', 'notifications', 'shortcuts'];
	let tab = $state(
		TABS.includes(page.url.searchParams.get('tab') ?? '')
			? page.url.searchParams.get('tab')!
			: 'connection'
	);
	function setTab(value: string) {
		tab = value;
		setSearchParam('tab', value, 'connection');
	}
</script>

<PageHeader title="Settings" />

<Tabs.Root value={tab} onValueChange={setTab} class="mt-6">
	<Tabs.List variant="line" class="w-full justify-start">
		<Tabs.Trigger value="connection" class="flex-none">Connection</Tabs.Trigger>
		<Tabs.Trigger value="appearance" class="flex-none">Appearance</Tabs.Trigger>
		<Tabs.Trigger value="courses" class="flex-none">Courses</Tabs.Trigger>
		<Tabs.Trigger value="notifications" class="flex-none">Notifications</Tabs.Trigger>
		<Tabs.Trigger value="shortcuts" class="flex-none">Shortcuts</Tabs.Trigger>
	</Tabs.List>

	<Tabs.Content value="connection" class="mt-4 flex flex-col gap-4">
		<AccountCard />
		<SourcesCard providers={data.providers} />
		<SyncCard connection={data.connection} />
		<RichSessionCard initial={data.rich} />
		<LinkAuthUserCard />
	</Tabs.Content>

	<Tabs.Content value="appearance" class="mt-4 flex flex-col gap-4">
		<ThemePicker />
	</Tabs.Content>

	<Tabs.Content value="courses" class="mt-4 flex flex-col gap-4">
		<CourseVisibility />
	</Tabs.Content>

	<Tabs.Content value="notifications" class="mt-4 flex flex-col gap-4">
		<NotificationsCard />
	</Tabs.Content>

	<Tabs.Content value="shortcuts" class="mt-4 flex flex-col gap-4">
		<ShortcutsTable />
	</Tabs.Content>
</Tabs.Root>
