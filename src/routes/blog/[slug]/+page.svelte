<script lang="ts">
	import { onMount } from 'svelte';
	import { formatDate, formatDistanceToNow } from '$lib/utils/date.js';
	import Comments from '$lib/components/dev-log/Comments.svelte';
	import MarkdownRenderer from '$lib/components/common/MarkdownRenderer.svelte';
	import type { Piece } from '$lib/types.js';

	export let data: { piece: Piece };
	$: piece = data.piece;

	let liked = false;
	let likesCount = 0;
	let bookmarked = false;
	let showShareMenu = false;

	onMount(() => {
		// 좋아요, 북마크 상태를 로컬 스토리지에서 불러오기
		const storedLikes = localStorage.getItem(`piece-${piece.id}-liked`);
		const storedBookmark = localStorage.getItem(`piece-${piece.id}-bookmarked`);

		liked = storedLikes === 'true';
		bookmarked = storedBookmark === 'true';

		// 실제 좋아요 수는 서버에서 가져와야 하지만, 여기서는 기본값 설정
		likesCount = Math.floor(Math.random() * 100) + 10;
	});
</script>

<svelte:head>
	<title>{piece.title} - naroso-o Blog</title>
	<meta name="description" content={piece.excerpt || ''} />
	<meta property="og:title" content={piece.title} />
	<meta property="og:description" content={piece.excerpt || ''} />
	{#if piece.thumbnail}
		<meta property="og:image" content={piece.thumbnail} />
	{/if}
</svelte:head>
