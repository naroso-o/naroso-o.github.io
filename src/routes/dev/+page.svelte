<script lang="ts">
	import PageHeader from '../../lib/components/common/PageHeader.svelte';
	import PostCard from '../../lib/components/dev-log/PostCard.svelte';
	let { data } = $props();

	let selectedIndex = $state(0);

	function handleKeydown(event: KeyboardEvent) {
		const key = event.key.toLowerCase();

		if (key === 'arrowup' || key === 'w') {
			event.preventDefault();
			selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : data.posts.length - 1;
		} else if (key === 'arrowdown' || key === 's') {
			event.preventDefault();
			selectedIndex = selectedIndex < data.posts.length - 1 ? selectedIndex + 1 : 0;
		} else if (key === 'enter' || key === ' ') {
			event.preventDefault();
			if (data.posts[selectedIndex]) {
				window.location.href = `/dev/${data.posts[selectedIndex].slug}`;
			}
		}
	}

	function handlePostHover(index: number) {
		selectedIndex = index;
	}
</script>

<svelte:head>
	<title>naroso-o 개발 로그</title>
	<meta name="description" content="developer naroso-o's dev log" />
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

<PageHeader
	title="Coding Journal"
	description="A personal record of development stories, reflections, and discoveries."
/>

<div class="post-container">
	<div class="post-wrapper">
		{#each data.posts as post, index}
			<div
				class="post-item"
				onmouseenter={() => handlePostHover(index)}
				role="button"
				tabindex="-1"
			>
				<PostCard {post} isSelected={selectedIndex === index} />
			</div>
		{/each}
	</div>
</div>

<style>
	.post-container {
		margin: 0 auto;
		padding: 2rem 1rem;

		background-color: #000;
		border: 4px solid #1d1618;
	}

	.post-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: calc(100vh - 20rem);
		overflow-y: auto;
		gap: 1rem;

		scrollbar-width: thin;
		scrollbar-color: #333 #000;
	}

	.post-item {
		width: 100%;
		max-width: 800px;
	}

	@media (max-width: 768px) {
		.post-wrapper {
		}

		.post-item {
			max-width: 100%;
		}
	}
</style>
