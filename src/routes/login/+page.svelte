<script lang="ts">
	import { authClient } from '#lib/auth-client.ts';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import { ProgressActivity as ProgressActivityIcon } from '@material-symbols-svg/svelte/rounded/icons/progress-activity';
	import { School as SchoolIcon } from '@material-symbols-svg/svelte/rounded/icons/school';

	let { data } = $props();

	let mode = $state<'signin' | 'signup'>('signin');
	let name = $state('');
	let email = $state('');
	let password = $state('');
	let busy = $state(false);
	let message = $state<string | null>(null);

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		busy = true;
		message = null;
		const result =
			mode === 'signin'
				? await authClient.signIn.email({ email, password })
				: await authClient.signUp.email({ email, password, name: name.trim() || email });
		busy = false;
		if (result.error) {
			message = result.error.message ?? 'Something went wrong.';
			return;
		}
		window.location.assign(data.next);
	}

	async function google() {
		busy = true;
		message = null;
		const result = await authClient.signIn.social({ provider: 'google', callbackURL: data.next });
		if (result.error) {
			busy = false;
			message = result.error.message ?? 'Google sign-in failed.';
		}
	}
</script>

<div class="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center px-4 py-10">
	<div class="rounded-3xl bg-surface p-8 sm:p-10">
		<div class="mb-8 flex flex-col items-start gap-4">
			<span
				class="flex size-14 items-center justify-center rounded-[40%] bg-primary-container text-on-primary-container"
			>
				<SchoolIcon class="size-7" />
			</span>
			<div>
				<h1 class="text-headline-lg text-on-surface">
					{mode === 'signin' ? 'Welcome back' : 'Create your account'}
				</h1>
				<p class="mt-2 text-body-lg text-pretty text-on-surface-variant">
					{mode === 'signin'
						? 'Sign in to see your Classroom.'
						: 'Your courses and settings stay private to this account.'}
				</p>
			</div>
		</div>

		<form onsubmit={submit} class="flex flex-col gap-4">
			<Field.Group>
				{#if mode === 'signup'}
					<Field.Field>
						<Field.Label for="name">Name</Field.Label>
						<Input id="name" bind:value={name} autocomplete="name" placeholder="Your name" />
					</Field.Field>
				{/if}
				<Field.Field>
					<Field.Label for="email">Email</Field.Label>
					<Input
						id="email"
						type="email"
						bind:value={email}
						required
						autocomplete="email"
						placeholder="you@school.org"
					/>
				</Field.Field>
				<Field.Field>
					<Field.Label for="password">Password</Field.Label>
					<Input
						id="password"
						type="password"
						bind:value={password}
						required
						minlength={8}
						autocomplete={mode === 'signin' ? 'current-password' : 'new-password'}
					/>
					{#if mode === 'signup'}
						<Field.Description>At least 8 characters.</Field.Description>
					{/if}
				</Field.Field>
			</Field.Group>

			{#if message}
				<p class="rounded-xl bg-error-container px-4 py-3 text-body-md text-on-error-container">
					{message}
				</p>
			{/if}

			<Button type="submit" disabled={busy} class="w-full">
				{#if busy}<ProgressActivityIcon data-icon="inline-start" class="animate-spin" />{/if}
				{mode === 'signin' ? 'Sign in' : 'Create account'}
			</Button>

			{#if data.googleLogin}
				<Button type="button" variant="outline" class="w-full" disabled={busy} onclick={google}>
					Continue with Google
				</Button>
			{/if}
		</form>

		<p class="mt-6 text-center text-body-md text-on-surface-variant">
			{#if mode === 'signin'}
				New here?
				<button
					type="button"
					class="font-medium text-primary underline-offset-2 hover:underline"
					onclick={() => ((mode = 'signup'), (message = null))}>Create an account</button
				>
			{:else}
				Already have an account?
				<button
					type="button"
					class="font-medium text-primary underline-offset-2 hover:underline"
					onclick={() => ((mode = 'signin'), (message = null))}>Sign in</button
				>
			{/if}
		</p>
	</div>
	<p class="mt-6 text-center text-body-sm text-on-surface-variant">
		<a href="/privacy" class="underline underline-offset-2">Privacy policy</a>
	</p>
</div>
