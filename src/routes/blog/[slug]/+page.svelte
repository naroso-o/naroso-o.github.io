<script lang="ts">
	import { onMount } from 'svelte';
	import MarkdownRenderer from '$lib/components/common/MarkdownRenderer.svelte';
	import { formatDate } from '$lib/utils/date';
	import type { Post } from '$lib/types';

	export let data;
	$: post = data.post as unknown as Post;

	let visible = false;
	onMount(() => { visible = true; });
</script>

<svelte:head>
	<title>{post?.title ?? 'Journal'} · naroso-o</title>
	<meta name="description" content={post?.excerpt ?? ''} />
</svelte:head>

<div class="post-page" class:visible>
	<div class="post-inner">

		<header class="post-header">
			<div class="post-label">[ JOURNAL ENTRY ]</div>
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
			<div class="footer-sigil">✦</div>
			<p class="footer-note">End of entry</p>
		</footer>
	</div>
</div>

<style>
	.post-page {
		min-height: calc(100vh - 60px);
		opacity: 0;
		transition: opacity 0.6s ease;
		overflow-y: auto;
		overflow-x: hidden;
	}
	.post-page.visible { opacity: 1; }

	.post-inner {
		max-width: 720px;
		margin: 0 auto;
		padding: 2.5rem 2rem 6rem;
	}

	.post-header {
		margin-bottom: 2.5rem;
	}
	.post-label {
		font-size: 0.58rem;
		letter-spacing: 0.35em;
		color: rgba(74,222,128,0.4);
		font-family: monospace;
		margin-bottom: 0.75rem;
	}
	.post-title {
		font-size: clamp(1.4rem, 3.5vw, 2.5rem);
		font-weight: 200;
		letter-spacing: 0.06em;
		line-height: 1.3;
		text-align: left;
		background: linear-gradient(135deg, #fff 0%, #a78bfa 60%, #4ade80 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin: 0 0 1rem;
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
		color: rgba(74,222,128,0.5);
		letter-spacing: 0.05em;
	}
	.post-date {
		font-size: 0.65rem;
		font-family: monospace;
		color: rgba(124,58,237,0.5);
		letter-spacing: 0.05em;
		white-space: nowrap;
	}
	.header-divider {
		height: 1px;
		background: linear-gradient(90deg, rgba(124,58,237,0.4), rgba(74,222,128,0.2), transparent);
		margin-top: 1.5rem;
	}

	/* ── Post content (markdown) ── */
	.post-content :global(h1),
	.post-content :global(h2),
	.post-content :global(h3) {
		font-weight: 300;
		letter-spacing: 0.05em;
		color: rgba(200,184,255,0.9);
		margin: 2rem 0 1rem;
	}
	.post-content :global(p) {
		font-size: 0.9rem;
		line-height: 1.9;
		color: rgba(200,184,255,0.65);
		margin-bottom: 1.2rem;
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
		background: rgba(8,0,24,0.8);
		border: 1px solid rgba(124,58,237,0.2);
		padding: 1.25rem;
		border-radius: 4px;
		overflow-x: auto;
		margin: 1.5rem 0;
	}
	.post-content :global(blockquote) {
		border-left: 2px solid rgba(124,58,237,0.5);
		padding-left: 1.5rem;
		color: rgba(167,139,250,0.6);
		font-style: italic;
		margin: 1.5rem 0;
	}
	.post-content :global(a) {
		color: #a78bfa;
		text-decoration: underline;
		text-decoration-color: rgba(124,58,237,0.3);
		transition: text-decoration-color 0.2s ease;
	}
	.post-content :global(a:hover) {
		text-decoration-color: #7c3aed;
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
