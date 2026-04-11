<script lang="ts">
	export let title: string = '';
	export let description: string = '';
	export let tag: string = '';
</script>

<div class="page-header">
	{#if tag}
		<div class="header-tag">{tag}</div>
	{/if}
	<h2 class="header-title">{title}</h2>
	{#if description}
		<p class="header-desc">{description}</p>
	{/if}
	<div class="header-line"></div>
</div>

<style>
	.page-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.6rem;
		padding: 2.5rem 1rem 2rem;
		text-align: center;
	}

	.header-tag {
		font-size: 0.58rem;
		letter-spacing: 0.35em;
		color: rgba(74,222,128,0.5);
		font-family: monospace;
	}

	.header-title {
		font-size: clamp(1.4rem, 3.5vw, 2.2rem);
		font-weight: 200;
		letter-spacing: 0.18em;
		background: linear-gradient(135deg, #ffffff 0%, #a78bfa 60%, #4ade80 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin: 0;
	}

	.header-desc {
		font-size: 0.78rem;
		letter-spacing: 0.1em;
		color: rgba(167,139,250,0.45);
		max-width: 480px;
		line-height: 1.7;
	}

	.header-line {
		width: 48px;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(124,58,237,0.7), rgba(74,222,128,0.4), transparent);
		margin-top: 0.5rem;
	}
</style>
