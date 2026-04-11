<script lang="ts">
	import { onMount } from 'svelte';
	import PageHeader from '$lib/components/common/PageHeader.svelte';
	import PostCard from '$lib/components/dev-log/PostCard.svelte';
	import type { Post } from '$lib/types';

	let { data } = $props();
	const posts = data.posts as unknown as Post[];

	let selectedIndex = $state(0);
	let pageVisible = $state(false);
	let visibleItems = $state<boolean[]>([]);

	function handleKeydown(event: KeyboardEvent) {
		const key = event.key.toLowerCase();
		if (key === 'arrowup' || key === 'w') {
			event.preventDefault();
			selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : posts.length - 1;
		} else if (key === 'arrowdown' || key === 's') {
			event.preventDefault();
			selectedIndex = selectedIndex < posts.length - 1 ? selectedIndex + 1 : 0;
		} else if (key === 'enter' || key === ' ') {
			event.preventDefault();
			if (posts[selectedIndex]) {
				window.location.href = `/dev/${posts[selectedIndex].slug}`;
			}
		}
	}

	onMount(() => {
		pageVisible = true;
		visibleItems = new Array(posts.length).fill(false);

		// stagger reveal
		posts.forEach((_, i) => {
			setTimeout(() => {
				visibleItems[i] = true;
			}, 80 + i * 60);
		});

		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});
</script>

<svelte:head>
	<title>DevLog · naroso-o</title>
	<meta name="description" content="Tech chronicles — development stories, discoveries, and reflections." />
</svelte:head>

<div class="dev-page" class:visible={pageVisible}>

	<!-- Subtle starfield background layer -->
	<div class="bg-layer"></div>

	<PageHeader
		tag="[ TECH LOG ]"
		title="DevLog"
		description="Chronicles of development — stories, discoveries, and honest reflections from the code frontier."
	/>

	<!-- Post count -->
	<div class="post-meta">
		<span class="post-count">{posts.length} entries</span>
		<div class="meta-line"></div>
	</div>

	<div class="posts-container">
		{#if posts.length === 0}
			<div class="empty-state">
				<div class="empty-icon">◎</div>
				<p>No transmissions received yet.</p>
			</div>
		{:else}
			<div class="post-list">
				{#each posts as post, index}
					<div
						class="post-item"
						class:item-visible={visibleItems[index]}
						style="transition-delay: {index * 0.04}s"
						onmouseenter={() => (selectedIndex = index)}
						role="listitem"
					>
						<PostCard {post} isSelected={selectedIndex === index} />
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.dev-page {
		position: relative;
		max-width: 860px;
		margin: 0 auto;
		padding: 1.5rem 2rem 5rem;
		min-height: calc(100vh - 60px);
		opacity: 0;
		transition: opacity 0.6s ease;
		overflow: hidden;
	}
	.dev-page.visible {
		opacity: 1;
	}

	/* Subtle background */
	.bg-layer {
		position: fixed;
		inset: 0;
		background:
			radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.04) 0%, transparent 60%),
			radial-gradient(ellipse at 80% 20%, rgba(74,222,128,0.03) 0%, transparent 50%);
		pointer-events: none;
		z-index: 0;
	}

	/* Post meta row */
	.post-meta {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
		position: relative;
		z-index: 1;
	}
	.post-count {
		font-size: 0.6rem;
		letter-spacing: 0.2em;
		color: rgba(74,222,128,0.4);
		font-family: monospace;
		white-space: nowrap;
	}
	.meta-line {
		flex: 1;
		height: 1px;
		background: linear-gradient(90deg, rgba(124,58,237,0.3), transparent);
	}

	/* Container */
	.posts-container {
		position: relative;
		z-index: 1;
	}

	/* Post list */
	.post-list {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	/* Item fade-in */
	.post-item {
		opacity: 0;
		transform: translateY(12px);
		transition:
			opacity 0.5s ease,
			transform 0.5s cubic-bezier(0.16,1,0.3,1);
	}
	.post-item.item-visible {
		opacity: 1;
		transform: translateY(0);
	}

	/* Empty state */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 5rem 0;
		color: rgba(124,58,237,0.3);
	}
	.empty-icon {
		font-size: 2rem;
		animation: emptyPulse 3s ease-in-out infinite;
	}
	@keyframes emptyPulse {
		0%, 100% { opacity: 0.3; }
		50%       { opacity: 0.7; }
	}
	.empty-state p {
		font-size: 0.8rem;
		letter-spacing: 0.15em;
		color: rgba(124,58,237,0.3);
	}

	@media (max-width: 640px) {
		.dev-page { padding: 1rem 1rem 4rem; }
	}
</style>
