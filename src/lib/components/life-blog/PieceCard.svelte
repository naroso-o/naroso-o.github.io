<script lang="ts">
	import type { Piece } from '../../types';
	import { base } from '$app/paths';

	export let piece: Piece;
	export let href: string = `${base}/blog/${piece.slug}`;

	let imgElement: HTMLImageElement;
	let isLandscape = false;

	function handleImageLoad() {
		if (imgElement) {
			isLandscape = imgElement.naturalWidth > imgElement.naturalHeight;
		}
	}
</script>

<article
	class="max-w-sm rounded-xl bg-card-bg border border-primary shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden flex flex-col"
>
	<a {href} class="block">
		{#if piece.thumbnail}
			<div class="w-full overflow-hidden">
				<img
					bind:this={imgElement}
					src={piece.thumbnail}
					alt={piece.title}
					class="w-full h-auto object-contain transition-transform duration-300 hover:scale-105"
					on:load={handleImageLoad}
				/>
			</div>
		{:else}
			<!-- 썸네일이 없는 경우 기본 배경 -->
			<div
				class="h-48 w-full bg-gradient-to-br from-primary/20 to-brand-primary/20 flex items-center justify-center"
			>
				<div class="text-primary/50 text-4xl font-bold">
					{piece.title.charAt(0).toUpperCase()}
				</div>
			</div>
		{/if}

		<!-- 카드 내용 추가 -->
		<div class="p-4">
			<h3 class="text-lg font-semibold text-primary mb-2 line-clamp-2">
				{piece.title}
			</h3>
			{#if piece.excerpt}
				<p class="text-sm text-secondary mb-3 line-clamp-3">
					{piece.excerpt}
				</p>
			{/if}
			{#if piece.created_at}
				<time class="text-xs text-secondary/70">
					{new Date(piece.created_at).toLocaleDateString('ko-KR')}
				</time>
			{/if}
		</div>
	</a>
</article>
