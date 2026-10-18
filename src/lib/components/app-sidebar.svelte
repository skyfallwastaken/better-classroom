<script lang="ts">
	import * as Sidebar from '#lib/components/ui/sidebar/index.js';
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { courseLabel, displayName, type CourseRef as Course } from '#lib/course.ts';
	import CourseAvatar from '#lib/components/course-avatar.svelte';
	import CourseMenu from '#lib/components/course-menu.svelte';
	import { editCourse } from '#lib/course-editor.svelte.ts';
	import { Home as HomeIcon, HomeFill } from '@material-symbols-svg/svelte/rounded/icons/home';
	import { Inbox as InboxIcon, InboxFill } from '@material-symbols-svg/svelte/rounded/icons/inbox';
	import {
		AssignmentTurnedIn as TodoIcon,
		AssignmentTurnedInFill as TodoFill
	} from '@material-symbols-svg/svelte/rounded/icons/assignment-turned-in';
	import {
		Settings as SettingsIcon,
		SettingsFill
	} from '@material-symbols-svg/svelte/rounded/icons/settings';
	import { School as SchoolIcon } from '@material-symbols-svg/svelte/rounded/icons/school';

	let {
		courses,
		inboxCount = 0,
		todoCount = 0
	}: {
		courses: Course[];
		inboxCount?: number;
		todoCount?: number;
	} = $props();

	const sidebar = Sidebar.useSidebar();
	afterNavigate(() => sidebar.setOpenMobile(false));

	const nav = $derived([
		{ href: '/', label: 'Home', icon: HomeIcon, active: HomeFill, count: 0 },
		{ href: '/inbox', label: 'Inbox', icon: InboxIcon, active: InboxFill, count: inboxCount },
		{ href: '/todo', label: 'To-do', icon: TodoIcon, active: TodoFill, count: todoCount }
	]);
	const isActive = (href: string) =>
		href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
	const settingsActive = $derived(page.url.pathname.startsWith('/settings'));
</script>

<Sidebar.Root collapsible="offcanvas">
	<Sidebar.Content class="pt-2">
		<Sidebar.Group>
			<Sidebar.GroupContent>
				<Sidebar.Menu class="gap-0.5">
					{#each nav as item (item.href)}
						{@const active = isActive(item.href)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton isActive={active}>
								{#snippet child({ props })}
									<a href={item.href} {...props}>
										{#if active}<item.active />{:else}<item.icon />{/if}
										<span>{item.label}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
							{#if item.count > 0}
								<Sidebar.MenuBadge>{item.count > 99 ? '99+' : item.count}</Sidebar.MenuBadge>
							{/if}
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
		<div class="mx-7 my-2 h-px bg-outline-variant"></div>
		<Sidebar.Group>
			<Sidebar.GroupLabel class="gap-3 [&>svg]:size-6"><SchoolIcon />Enrolled</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu class="gap-0.5">
					{#each courses as course (course.id)}
						{@const label = courseLabel(course.section)}
						<Sidebar.MenuItem>
							<CourseMenu {course} onRename={editCourse}>
								<Sidebar.MenuButton
									size="lg"
									class="pl-3"
									isActive={page.url.pathname.startsWith(`/courses/${course.id}`)}
									tooltipContent={displayName(course)}
								>
									{#snippet child({ props })}
										<a href={`/courses/${course.id}`} {...props}>
											<CourseAvatar
												id={course.id}
												name={displayName(course)}
												class="size-8! text-label-lg"
											/>
											<span class="grid min-w-0 leading-tight">
												<span class="truncate">{displayName(course)}</span>
												{#if label}<span class="truncate text-label-md font-normal opacity-80"
														>{label}</span
													>{/if}
											</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</CourseMenu>
						</Sidebar.MenuItem>
					{:else}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href="/settings" {...props}><span>No courses synced yet</span></a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer class="px-3 pb-3">
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton isActive={settingsActive}>
					{#snippet child({ props })}
						<a href="/settings" {...props}>
							{#if settingsActive}<SettingsFill />{:else}<SettingsIcon />{/if}
							<span>Settings</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>
