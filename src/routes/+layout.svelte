<script lang="ts">
	import { onMount } from 'svelte';
	import { onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	function getParentPath(currentPath: string): string {
		const segments = currentPath.split('/').filter(Boolean);
		if (segments.length === 0) {
			return '/';
		}
		segments.pop();
		return segments.length === 0 ? '/' : '/' + segments.join('/');
	}

	function navigateBack() {
		const currentPath = $page.url.pathname;
		const parentPath = getParentPath(currentPath);
		goto(parentPath);
	}

	function handleKeydown(event: KeyboardEvent) {
		const key = event.key.toLowerCase();
		let backspaceKeys = ['backspace', 'escape', 'esc', 'x', 'delete'];
		if (backspaceKeys.includes(key)) {
			event.preventDefault();
			navigateBack();
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
	});

	onDestroy(() => {
		window.removeEventListener('keydown', handleKeydown);
	});
</script>

<svelte:head></svelte:head>

<div class="layout-container">
	<header class="header-container">
		{#if $page.url.pathname !== '/'}
			<button class="back-button" aria-label="Back" onclick={navigateBack}
				><svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-arrow-left"><path d="M19 12H5" /><path d="M12 19L5 12L12 5" /></svg
				></button
			>
		{/if}
		<div class="question-mark">?</div>
	</header>
	<main class="main-container">
		<slot />
	</main>
</div>

<style>
	@import '../app.css';

	.layout-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100vh;
		box-sizing: border-box;

		padding: 2rem;
	}

	.header-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: fit-content;
	}

	.main-container {
		width: 100%;
		height: 100%;
		margin: 0 auto;
	}

	.back-button {
		background: none;
		border: none;
		color: #fff;
		cursor: pointer;
		font-size: 1rem;
		filter: blur(0.5px);
	}

	.question-mark {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 20px;
		height: 20px;
		margin-left: auto;

		border-radius: 50%;
		border: 2px solid #fff;
		color: #fff;
		line-height: 1;
		font-size: 0.8rem;
		font-weight: bold;
		cursor: pointer;
		filter: blur(0.5px);
	}

	@media (max-width: 768px) {
		.layout-container {
			padding: 1rem;
		}
	}
</style>
