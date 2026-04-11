<script lang="ts">
	import { formatDate } from '$lib/utils/date';
	import type { Post } from '$lib/types';

	let {
		post,
		maxTags = null,
		href = null,
		isSelected = false
	}: { post: Post; maxTags?: number | null; href?: string | null; isSelected?: boolean } = $props();

	let displayTags = $derived(maxTags ? post.tags?.slice(0, maxTags) : post.tags);
</script>

<button
	class="post-card"
	class:selected={isSelected}
	onclick={() => {
		window.location.href = href || `/dev/${post.slug}`;
	}}
	type="button"
	tabindex="-1"
>
	<!-- Left accent bar -->
	<div class="accent-bar" class:active={isSelected}></div>

	<div class="card-content">
		<div class="card-top">
			<span class="card-title" class:active={isSelected}>{post.title}</span>
			{#if post.featured}
				<span class="featured-badge">★</span>
			{/if}
		</div>

		{#if post.excerpt}
			<p class="card-excerpt">{post.excerpt}</p>
		{/if}

		<footer class="card-footer">
			<time class="card-date">{formatDate(post.created)}</time>
			{#if displayTags && displayTags.length > 0}
				<div class="card-tags">
					{#each displayTags as tag}
						<span class="tag">#{tag}</span>
					{/each}
				</div>
			{/if}
		</footer>
	</div>

	<!-- Hover glow -->
	<div class="card-glow" class:active={isSelected}></div>
</button>

<style>
	.post-card {
		position: relative;
		display: flex;
		align-items: stretch;
		gap: 0;
		width: 100%;
		padding: 0;
		background: rgba(8,0,24,0.5);
		border: 1px solid rgba(124,58,237,0.12);
		cursor: none;
		text-align: left;
		overflow: hidden;
		transition:
			border-color 0.3s ease,
			background 0.3s ease,
			transform 0.3s cubic-bezier(0.16,1,0.3,1);
	}
	.post-card:hover,
	.post-card.selected {
		border-color: rgba(124,58,237,0.45);
		background: rgba(124,58,237,0.06);
		transform: translateX(4px);
	}

	/* Left accent bar */
	.accent-bar {
		width: 2px;
		background: rgba(124,58,237,0.2);
		flex-shrink: 0;
		transition: background 0.3s ease;
	}
	.accent-bar.active {
		background: linear-gradient(180deg, #7c3aed, #4ade80);
	}

	.card-content {
		flex: 1;
		padding: 1rem 1.2rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.card-top {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
	}

	.card-title {
		font-size: 0.9rem;
		color: rgba(200,184,255,0.8);
		letter-spacing: 0.03em;
		line-height: 1.4;
		flex: 1;
		transition: color 0.3s ease;
	}
	.card-title.active {
		color: #ffffff;
	}

	.featured-badge {
		font-size: 0.6rem;
		color: rgba(74,222,128,0.7);
		flex-shrink: 0;
		margin-top: 0.15rem;
	}

	.card-excerpt {
		font-size: 0.75rem;
		color: rgba(167,139,250,0.4);
		line-height: 1.6;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.card-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 0.25rem;
	}

	.card-date {
		font-size: 0.65rem;
		color: rgba(124,58,237,0.5);
		font-family: monospace;
		letter-spacing: 0.05em;
		white-space: nowrap;
	}

	.card-tags {
		display: flex;
		gap: 0.4rem;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.tag {
		font-size: 0.6rem;
		color: rgba(74,222,128,0.5);
		letter-spacing: 0.05em;
	}

	/* Hover glow overlay */
	.card-glow {
		position: absolute;
		inset: 0;
		background: linear-gradient(90deg, rgba(124,58,237,0.04), transparent);
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s ease;
	}
	.card-glow.active {
		opacity: 1;
	}

	@media (max-width: 480px) {
		.card-footer {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.3rem;
		}
		.card-tags { justify-content: flex-start; }
	}
</style>
