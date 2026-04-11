<script lang="ts">
	import { onMount } from 'svelte';
	import PageHeader from '$lib/components/common/PageHeader.svelte';
	import type { Post } from '$lib/types';

	let { data } = $props();

	// blog page data might be empty — graceful fallback
	const posts: Post[] = (data?.posts as unknown as Post[]) ?? [];

	let pageVisible = $state(false);
	let selectedIndex = $state(0);
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
				window.location.href = `/blog/${posts[selectedIndex].slug}`;
			}
		}
	}

	onMount(() => {
		pageVisible = true;
		visibleItems = new Array(posts.length).fill(false);
		posts.forEach((_, i) => {
			setTimeout(() => { visibleItems[i] = true; }, 100 + i * 70);
		});
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});
</script>

<svelte:head>
	<title>Journals · naroso-o</title>
	<meta name="description" content="Daily logs — everyday thoughts, reflections, and small observations." />
</svelte:head>

<div class="blog-page" class:visible={pageVisible}>

	<div class="bg-layer"></div>

	<PageHeader
		tag="[ DAILY LOG ]"
		title="Journals"
		description="Everyday thoughts, reflections, and small observations — signals from the ordinary."
	/>

	<div class="post-meta">
		<span class="post-count">{posts.length} entries</span>
		<div class="meta-line"></div>
	</div>

	<div class="entries-container">
		{#if posts.length === 0}
			<div class="empty-state">
				<div class="empty-icon">◎</div>
				<p>The journal is silent for now.</p>
			</div>
		{:else}
			<div class="entries-list">
				{#each posts as post, index}
					<a
						href="/blog/{post.slug}"
						class="entry-item"
						class:item-visible={visibleItems[index]}
						class:selected={selectedIndex === index}
						style="transition-delay: {index * 0.05}s"
						onmouseenter={() => (selectedIndex = index)}
					>
						<div class="entry-date">{post.created?.slice(0, 10) ?? ''}</div>
						<div class="entry-body">
							<div class="entry-title" class:active={selectedIndex === index}>
								{post.title}
							</div>
							{#if post.excerpt}
								<p class="entry-excerpt">{post.excerpt}</p>
							{/if}
						</div>
						{#if post.tags && post.tags.length > 0}
							<div class="entry-tags">
								{#each post.tags.slice(0, 3) as tag}
									<span class="tag">#{tag}</span>
								{/each}
							</div>
						{/if}
						<div class="entry-arrow">→</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.blog-page {
		position: relative;
		max-width: 760px;
		margin: 0 auto;
		padding: 1.5rem 2rem 5rem;
		min-height: calc(100vh - 60px);
		opacity: 0;
		transition: opacity 0.6s ease;
	}
	.blog-page.visible { opacity: 1; }

	.bg-layer {
		position: fixed;
		inset: 0;
		background:
			radial-gradient(ellipse at 70% 60%, rgba(74,222,128,0.04) 0%, transparent 55%),
			radial-gradient(ellipse at 30% 30%, rgba(124,58,237,0.03) 0%, transparent 50%);
		pointer-events: none;
		z-index: 0;
	}

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
		background: linear-gradient(90deg, rgba(74,222,128,0.25), transparent);
	}

	.entries-container {
		position: relative;
		z-index: 1;
	}

	.entries-list {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.entry-item {
		display: grid;
		grid-template-columns: 90px 1fr auto auto;
		align-items: center;
		gap: 1.2rem;
		padding: 1rem 0.8rem;
		border-bottom: 1px solid rgba(124,58,237,0.08);
		text-decoration: none;
		cursor: none;
		opacity: 0;
		transform: translateY(10px);
		transition:
			opacity 0.5s ease,
			transform 0.5s cubic-bezier(0.16,1,0.3,1),
			background 0.25s ease;
	}
	.entry-item.item-visible {
		opacity: 1;
		transform: translateY(0);
	}
	.entry-item:hover,
	.entry-item.selected {
		background: rgba(124,58,237,0.04);
	}

	.entry-date {
		font-size: 0.62rem;
		font-family: monospace;
		color: rgba(74,222,128,0.4);
		letter-spacing: 0.04em;
		white-space: nowrap;
	}

	.entry-body {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		min-width: 0;
	}

	.entry-title {
		font-size: 0.88rem;
		color: rgba(200,184,255,0.75);
		transition: color 0.25s ease;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.entry-title.active {
		color: #ffffff;
	}

	.entry-excerpt {
		font-size: 0.7rem;
		color: rgba(167,139,250,0.35);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.entry-tags {
		display: flex;
		gap: 0.4rem;
	}
	.tag {
		font-size: 0.58rem;
		color: rgba(74,222,128,0.4);
		letter-spacing: 0.04em;
	}

	.entry-arrow {
		font-size: 0.7rem;
		color: rgba(74,222,128,0.3);
		opacity: 0;
		transform: translateX(-4px);
		transition:
			opacity 0.25s ease,
			transform 0.25s ease;
	}
	.entry-item:hover .entry-arrow,
	.entry-item.selected .entry-arrow {
		opacity: 1;
		transform: translateX(0);
	}

	/* Empty */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 5rem 0;
	}
	.empty-icon {
		font-size: 1.8rem;
		color: rgba(74,222,128,0.2);
		animation: pulse 3s ease-in-out infinite;
	}
	@keyframes pulse {
		0%, 100% { opacity: 0.3; }
		50%       { opacity: 0.7; }
	}
	.empty-state p {
		font-size: 0.78rem;
		letter-spacing: 0.15em;
		color: rgba(74,222,128,0.25);
	}

	@media (max-width: 640px) {
		.blog-page { padding: 1rem 1rem 4rem; }
		.entry-item {
			grid-template-columns: 1fr auto;
			grid-template-rows: auto auto;
		}
		.entry-date { display: none; }
		.entry-tags { display: none; }
	}
</style>
