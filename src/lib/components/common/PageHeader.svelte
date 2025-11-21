<script lang="ts">
	export let title: string = '';
	export let description: string = '';
</script>

<div class="page-header">
	<h2>{title}</h2>
	{#if description}
		<p>{description}</p>
	{/if}
</div>

<style>
	.page-header {
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: center;
		margin-bottom: 2rem;
	}

	h2 {
		color: #f7d022;
		filter: blur(1px);
	}

	p {
		filter: blur(0.8px);
	}

	@media (max-width: 768px) {
		.page-header {
			padding: 0 1rem;
			margin-bottom: 1rem;
		}
	}
</style>
