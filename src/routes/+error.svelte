<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
</script>

<div class="error-page">
	<div class="error-code">{$page.status}</div>
	<div class="error-label">[ SIGNAL LOST ]</div>
	<h1 class="error-title">
		{#if $page.status === 404}
			Coordinates not found
		{:else}
			Transmission error
		{/if}
	</h1>
	<p class="error-desc">
		{$page.error?.message ?? 'The signal you were looking for has drifted into the void.'}
	</p>

	<button class="error-btn" onclick={() => goto('/')}>
		← Return to origin
	</button>
</div>

<style>
	.error-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		text-align: center;
		padding: 2rem;
		gap: 1rem;
	}

	.error-code {
		font-size: clamp(5rem, 15vw, 10rem);
		font-weight: 100;
		letter-spacing: 0.15em;
		background: linear-gradient(135deg, rgba(124,58,237,0.3), rgba(74,222,128,0.2));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		line-height: 1;
	}

	.error-label {
		font-size: 0.6rem;
		letter-spacing: 0.4em;
		color: rgba(74,222,128,0.4);
		font-family: monospace;
	}

	.error-title {
		font-size: clamp(1.2rem, 3vw, 2rem);
		font-weight: 200;
		letter-spacing: 0.1em;
		color: rgba(200,184,255,0.7);
		margin: 0;
	}

	.error-desc {
		font-size: 0.85rem;
		color: rgba(167,139,250,0.4);
		max-width: 420px;
		line-height: 1.7;
	}

	.error-btn {
		margin-top: 1.5rem;
		padding: 0.6rem 1.5rem;
		border: 1px solid rgba(124,58,237,0.35);
		color: rgba(167,139,250,0.7);
		font-size: 0.75rem;
		letter-spacing: 0.15em;
		cursor: none;
		transition:
			border-color 0.3s ease,
			color 0.3s ease,
			background 0.3s ease;
	}
	.error-btn:hover {
		border-color: rgba(124,58,237,0.7);
		color: #a78bfa;
		background: rgba(124,58,237,0.08);
	}
</style>
