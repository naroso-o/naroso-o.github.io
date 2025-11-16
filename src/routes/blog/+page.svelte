<script lang="ts">
	import PageHeader from '$lib/components/common/PageHeader.svelte';
	import NoPostMessage from '../../lib/components/common/NoPostMessage.svelte';
	import PieceCard from '../../lib/components/life-blog/PieceCard.svelte';

	export let data;
</script>

<svelte:head>
	<title>naroso-o Blog</title>
	<meta name="description" content="developer naroso-o's daily life blog" />
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-8">
	<PageHeader
		title="Life Journal"
		description="Personal notes and moments from everyday life beyond code."
	/>

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
