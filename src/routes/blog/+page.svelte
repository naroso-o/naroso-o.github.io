<script lang="ts">
	import PageHeader from '$lib/components/common/PageHeader.svelte';
	import NoPostMessage from '../../lib/components/common/NoPostMessage.svelte';
	import PieceCard from '../../lib/components/life-blog/PieceCard.svelte';

	export let data;
</script>

<svelte:head>
	<title>naroso-o 일상 블로그</title>
	<meta name="description" content="developer naroso-o's daily life blog" />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8">
	<PageHeader title="블로그" description="일상을 기록합니다." />

	{#if data.pieces && data.pieces.length > 0}
		<div class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
			{#each data.pieces as piece}
				<div class="break-inside-avoid mb-6">
					<PieceCard {piece} />
				</div>
			{/each}
		</div>
	{:else}
		<NoPostMessage />
	{/if}
</div>
