<script lang="ts">
	import { onMount } from 'svelte';
	import MarkdownRenderer from '$lib/components/common/MarkdownRenderer.svelte';
	import { generateSEOData, generatePostStatus } from '$lib/utils/meta';
	import { formatDate } from '$lib/utils/date';
	import type { Post } from '$lib/types';

	export let data;
	$: post = data.post as unknown as Post;
	$: seoData = generateSEOData(post);

	let visible = false;
	let scrollProgress = 0;

	onMount(() => {
		visible = true;
		const el = document.querySelector('.post-scroll-area') as HTMLElement;
		if (el) {
			el.addEventListener('scroll', () => {
				scrollProgress = el.scrollTop / (el.scrollHeight - el.clientHeight || 1);
			});
		}
	});
</script>

<svelte:head>
	<title>{seoData.title}</title>
	<meta name="description" content={seoData.description} />
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

<!-- Reading progress bar -->
<div class="progress-bar" style="width: {scrollProgress * 100}%"></div>

<div class="post-page" class:visible>
	<div class="post-scroll-area">
		<div class="post-inner">

			<header class="post-header">
				<div class="post-label">[ DEV LOG ENTRY ]</div>
				<h1 class="post-title">{post?.title ?? ''}</h1>

				<div class="post-meta">
					{#if post?.tags && post.tags.length > 0}
						<div class="post-tags">
							{#each post.tags as tag}
								<span class="tag">#{tag}</span>
							{/each}
						</div>
					{/if}
					<time class="post-date">{formatDate(post?.created ?? '')}</time>
				</div>

				<div class="header-divider"></div>
			</header>

			<div class="post-content">
				<MarkdownRenderer content={post?.content ?? ''} />
			</div>

			<footer class="post-footer">
				<div class="footer-sigil">◉</div>
				<p class="footer-note">Signal ends here · Transmission complete</p>
			</footer>
		</div>
	</div>
</div>

<style>
	/* Reading progress bar */
	.progress-bar {
		position: fixed;
		top: 59px;
		left: 0;
		height: 1px;
		background: linear-gradient(90deg, #7c3aed, #4ade80);
		z-index: 200;
		transition: width 0.1s ease;
		box-shadow: 0 0 6px rgba(124,58,237,0.6);
	}

	.post-page {
		height: calc(100vh - 60px);
		opacity: 0;
		transition: opacity 0.6s ease;
	}
	.post-page.visible { opacity: 1; }

	.post-scroll-area {
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		scrollbar-width: thin;
		scrollbar-color: rgba(124,58,237,0.4) transparent;
	}

	.post-inner {
		max-width: 720px;
		margin: 0 auto;
		padding: 2.5rem 2rem 6rem;
	}

	/* Header */
	.post-header { margin-bottom: 2.5rem; }
	.post-label {
		font-size: 0.58rem;
		letter-spacing: 0.35em;
		color: rgba(74,222,128,0.45);
		font-family: monospace;
		margin-bottom: 0.75rem;
	}
	.post-title {
		font-size: clamp(1.5rem, 3.5vw, 2.8rem);
		font-weight: 200;
		letter-spacing: 0.04em;
		line-height: 1.25;
		text-align: left;
		background: linear-gradient(135deg, #fff 0%, #a78bfa 50%, #4ade80 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin: 0 0 1.25rem;
	}
	.post-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}
	.post-tags {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	.tag {
		font-size: 0.65rem;
		color: rgba(74,222,128,0.55);
		letter-spacing: 0.05em;
	}
	.post-date {
		font-size: 0.65rem;
		font-family: monospace;
		color: rgba(124,58,237,0.55);
		letter-spacing: 0.05em;
		white-space: nowrap;
	}
	.header-divider {
		height: 1px;
		background: linear-gradient(90deg, rgba(124,58,237,0.5), rgba(74,222,128,0.25), transparent);
		margin-top: 1.5rem;
	}

	/* Content */
	.post-content :global(h1),
	.post-content :global(h2),
	.post-content :global(h3),
	.post-content :global(h4) {
		font-weight: 300;
		letter-spacing: 0.04em;
		color: rgba(200,184,255,0.9);
		margin: 2.5rem 0 1rem;
	}
	.post-content :global(h2) {
		font-size: 1.3rem;
		border-bottom: 1px solid rgba(124,58,237,0.15);
		padding-bottom: 0.5rem;
	}
	.post-content :global(p) {
		font-size: 0.9rem;
		line-height: 1.95;
		color: rgba(200,184,255,0.65);
		margin-bottom: 1.3rem;
	}
	.post-content :global(ul),
	.post-content :global(ol) {
		padding-left: 1.5rem;
		margin-bottom: 1.3rem;
	}
	.post-content :global(li) {
		font-size: 0.9rem;
		line-height: 1.8;
		color: rgba(200,184,255,0.65);
		margin-bottom: 0.4rem;
	}
	.post-content :global(code) {
		font-family: monospace;
		font-size: 0.8rem;
		background: rgba(124,58,237,0.12);
		border: 1px solid rgba(124,58,237,0.2);
		padding: 0.15em 0.4em;
		border-radius: 2px;
		color: #a78bfa;
	}
	.post-content :global(pre) {
		background: rgba(8,0,24,0.85);
		border: 1px solid rgba(124,58,237,0.25);
		border-left: 2px solid rgba(124,58,237,0.6);
		padding: 1.25rem 1.5rem;
		border-radius: 0 4px 4px 0;
		overflow-x: auto;
		margin: 1.5rem 0;
		scrollbar-width: thin;
	}
	.post-content :global(pre code) {
		background: none;
		border: none;
		padding: 0;
		font-size: 0.82rem;
		color: rgba(200,184,255,0.85);
	}
	.post-content :global(blockquote) {
		border-left: 2px solid rgba(124,58,237,0.5);
		padding: 0.5rem 0 0.5rem 1.5rem;
		color: rgba(167,139,250,0.6);
		font-style: italic;
		margin: 1.5rem 0;
		background: rgba(124,58,237,0.04);
	}
	.post-content :global(a) {
		color: #a78bfa;
		text-decoration: underline;
		text-decoration-color: rgba(124,58,237,0.3);
		cursor: none;
		transition: text-decoration-color 0.2s ease, color 0.2s ease;
	}
	.post-content :global(a:hover) {
		color: #c4b5fd;
		text-decoration-color: #7c3aed;
	}
	.post-content :global(hr) {
		border: none;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(124,58,237,0.35), rgba(74,222,128,0.2), transparent);
		margin: 2.5rem 0;
	}
	.post-content :global(img) {
		max-width: 100%;
		border: 1px solid rgba(124,58,237,0.2);
		border-radius: 4px;
	}

	/* Footer */
	.post-footer {
		text-align: center;
		padding: 3rem 0 0;
	}
	.footer-sigil {
		font-size: 1rem;
		color: rgba(124,58,237,0.3);
		animation: sigil 4s ease-in-out infinite;
	}
	@keyframes sigil {
		0%, 100% { opacity: 0.2; }
		50%       { opacity: 0.7; }
	}
	.footer-note {
		font-size: 0.58rem;
		letter-spacing: 0.25em;
		color: rgba(124,58,237,0.2);
		margin-top: 0.4rem;
	}

	@media (max-width: 640px) {
		.post-inner { padding: 1.5rem 1rem 4rem; }
	}
</style>
