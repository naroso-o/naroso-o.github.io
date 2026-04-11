<script lang="ts">
	import { onMount } from 'svelte';

	let cx = $state(-100);
	let cy = $state(-100);
	let trailDots: { x: number; y: number; id: number }[] = $state([]);
	let idCounter = 0;

	onMount(() => {
		function move(e: MouseEvent) {
			cx = e.clientX;
			cy = e.clientY;
			idCounter++;
			trailDots = [
				...trailDots.slice(-10),
				{ x: e.clientX, y: e.clientY, id: idCounter }
			];
		}
		window.addEventListener('mousemove', move);
		return () => window.removeEventListener('mousemove', move);
	});
</script>

<!-- Trail dots -->
{#each trailDots as dot, i (dot.id)}
	<div
		class="trail-dot"
		style="
      left: {dot.x}px;
      top: {dot.y}px;
      width: {2 + i * 0.5}px;
      height: {2 + i * 0.5}px;
      opacity: {(i / trailDots.length) * 0.5};
    "
	></div>
{/each}

<!-- Main cursor ring -->
<div class="cursor-ring" style="left: {cx}px; top: {cy}px;"></div>
<!-- Inner dot -->
<div class="cursor-dot" style="left: {cx}px; top: {cy}px;"></div>

<style>
	.cursor-ring {
		position: fixed;
		width: 28px;
		height: 28px;
		border: 1px solid rgba(167, 139, 250, 0.7);
		border-radius: 50%;
		transform: translate(-50%, -50%);
		pointer-events: none;
		z-index: 99999;
		transition:
			width 0.2s ease,
			height 0.2s ease,
			border-color 0.2s ease;
		box-shadow: 0 0 8px rgba(124, 58, 237, 0.4);
	}

	.cursor-dot {
		position: fixed;
		width: 4px;
		height: 4px;
		background: #a78bfa;
		border-radius: 50%;
		transform: translate(-50%, -50%);
		pointer-events: none;
		z-index: 100000;
		box-shadow: 0 0 6px #7c3aed;
	}

	.trail-dot {
		position: fixed;
		background: rgba(124, 58, 237, 0.6);
		border-radius: 50%;
		transform: translate(-50%, -50%);
		pointer-events: none;
		z-index: 99990;
		transition: opacity 0.3s ease;
	}
</style>
