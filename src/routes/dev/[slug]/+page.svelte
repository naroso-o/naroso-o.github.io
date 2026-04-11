<script lang="ts">
	import MarkdownRenderer from '$lib/components/common/MarkdownRenderer.svelte';
	import { generateSEOData, generatePostStatus } from '$lib/utils/meta';
	import { formatDate } from '$lib/utils/date';
	import type { Post } from '$lib/types';
	export let data;

	$: post = data.post as unknown as Post;
	$: seoData = generateSEOData(post);
	$: postStatus = generatePostStatus(post);
</script>

<svelte:head>
	<title>{seoData.title}</title>
	<meta name="description" content={seoData.description} />

	<!-- Open Graph 메타태그 -->
	<meta property="og:title" content={seoData.openGraph.title} />
	<meta property="og:description" content={seoData.openGraph.description} />
	<meta property="og:type" content={seoData.openGraph.type} />
	<meta property="article:published_time" content={seoData.openGraph.publishedTime} />
	<meta property="article:modified_time" content={seoData.openGraph.modifiedTime} />
	{#if seoData.openGraph.tags.length > 0}
		{#each seoData.openGraph.tags as tag}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}
</svelte:head>

<div class="content-container">
	<div class="title">{post.title}</div>
	<div class="info-container">
		{#if post.tags && post.tags.length > 0}
			<div class="tags">
				{#each post.tags as tag}
					<span>#{tag}</span>
				{/each}
			</div>
		{/if}

		<time>
			{formatDate(post.created)}
		</time>
	</div>
	<MarkdownRenderer content={post.content ?? ''} />
</div>

<style>
	.content-container {
		width: 100%;
		height: calc(100vh - 7rem);
		box-sizing: border-box;
		margin-top: 2rem;
		padding: 4rem 8rem 4rem 8rem;

		background-color: #000;
		border: 4px solid #1d1618;

		overflow-y: auto;
		overflow-x: hidden;
		scrollbar-width: thin;
		scrollbar-color: #333 #000;
		scrollbar-width: thin;
	}

	.title {
		font-size: 2rem;
		font-weight: 700;
		color: #fff;
		margin-bottom: 4rem;
	}

	.info-container {
		display: flex;
		justify-content: space-between;
		align-items: start;
		gap: 1rem;

		margin-bottom: 2rem;
	}

	.tags {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.tags span {
		font-size: 1rem;
		color: #999;
		filter: blur(0.5px);
	}

	time {
		font-size: 1rem;
		color: #fff;
		filter: blur(0.5px);
	}

	@media (max-width: 768px) {
		.content-container {
			padding: 1rem;
		}

		.title {
			margin-bottom: 2rem;
		}

		.info-container {
			flex-direction: column;
			gap: 0.5rem;
			align-items: flex-end;
		}
	}
</style>
