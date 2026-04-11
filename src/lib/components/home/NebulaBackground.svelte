<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let animId: number;
	let t = 0;

	function draw() {
		animId = requestAnimationFrame(draw);
		t += 0.002;
		const ctx = canvas.getContext('2d')!;
		const W = canvas.width;
		const H = canvas.height;
		ctx.clearRect(0, 0, W, H);

		// Animated nebula clouds using layered radial gradients
		const clouds = [
			{ x: W * 0.3, y: H * 0.4, r: W * 0.5, color: '124,58,237', alpha: 0.06 + 0.03 * Math.sin(t) },
			{ x: W * 0.7, y: H * 0.6, r: W * 0.45, color: '74,222,128', alpha: 0.04 + 0.02 * Math.sin(t + 1.5) },
			{ x: W * 0.5, y: H * 0.3, r: W * 0.55, color: '167,139,250', alpha: 0.05 + 0.025 * Math.cos(t * 0.7) },
			{ x: W * 0.2, y: H * 0.7, r: W * 0.35, color: '110,231,183', alpha: 0.03 + 0.015 * Math.sin(t * 1.3) },
			{ x: W * 0.8, y: H * 0.2, r: W * 0.4,  color: '76,29,149',  alpha: 0.07 + 0.03 * Math.cos(t * 0.5) }
		];

		for (const c of clouds) {
			const ox = Math.sin(t * 0.4 + c.x) * 40;
			const oy = Math.cos(t * 0.3 + c.y) * 30;
			const grad = ctx.createRadialGradient(c.x + ox, c.y + oy, 0, c.x + ox, c.y + oy, c.r);
			grad.addColorStop(0, `rgba(${c.color},${c.alpha})`);
			grad.addColorStop(0.5, `rgba(${c.color},${c.alpha * 0.4})`);
			grad.addColorStop(1, 'transparent');
			ctx.fillStyle = grad;
			ctx.fillRect(0, 0, W, H);
		}
	}

	function resize() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

	onMount(() => {
		resize();
		window.addEventListener('resize', resize);
		draw();
		return () => {
			cancelAnimationFrame(animId);
			window.removeEventListener('resize', resize);
		};
	});
</script>

<canvas bind:this={canvas} class="nebula-bg"></canvas>

<style>
	.nebula-bg {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		z-index: 1;
		pointer-events: none;
	}
</style>
