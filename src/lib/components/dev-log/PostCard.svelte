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
	<div class="triangle-icon" class:active={isSelected}></div>
	<div class="content">
		<div class="title" class:active={isSelected}>
			{post.title}
		</div>

		<footer>
			<time class="date text-inverse">{formatDate(post.created_at)}</time>
			{#if displayTags && displayTags.length > 0}
				<div class="tags">
					{#each displayTags as tag}
						<span>#{tag}</span>
					{/each}
				</div>
			{/if}
		</footer>
	</div>
</button>

<style>
	.post-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		width: 100%;
		padding: 1rem;

		background: none;
		border: 0.1rem solid #fff;

		cursor: pointer;
		transition: border-color 0.2s ease;
	}

	.post-card:hover {
		cursor: pointer;
	}

	.post-card.selected {
		border-color: #f7d022;
	}

	.triangle-icon {
		width: 0;
		height: 0;
		border-left: 0.5rem solid transparent;
		border-right: 0.5rem solid transparent;
		border-bottom: 0.5rem solid #f7d022;
		transform: rotate(90deg);
		opacity: 0;
		filter: blur(1px);
		transition: opacity 0.2s ease;
		flex-shrink: 0;
	}

	.triangle-icon.active {
		opacity: 1;
	}

	.content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		gap: 2rem;
	}

	.title {
		color: #fff;
		font-size: 1rem;
		white-space: nowrap;
		transition: color 0.2s ease;
		filter: blur(0.5px);
	}

	.title.active {
		color: #f7d022;
	}

	.post-card footer {
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: flex-end;
		gap: 0.5rem;
	}

	.tags {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.tags span {
		font-size: 0.8rem;
		color: #999;
		filter: blur(0.5px);
	}

	time {
		font-size: 0.8rem;
		color: #999;
		filter: blur(0.5px);
	}

	@media (max-width: 768px) {
		.post-card {
			padding: 0.5rem;
		}

		.content {
			gap: 0.5rem;
		}

		.title {
			font-size: 0.8rem;
		}

		.post-card footer {
			gap: 0.5rem;
		}

		.tags {
			gap: 0.5rem;
		}

		time {
			font-size: 0.6rem;
		}

		.tags span {
			font-size: 0.6rem;
		}
	}

	@media (max-width: 480px) {
		.post-card {
			padding: 0.5rem;
		}

		.content {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.title {
			font-size: 0.8rem;
		}

		.post-card footer {
			width: 100%;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			gap: 0.5rem;
		}

		.tags {
			gap: 0.5rem;
		}

		.tags span {
			font-size: 0.6rem;
		}

		time {
			font-size: 0.6rem;
		}
	}
</style>
