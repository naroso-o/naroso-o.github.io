<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let animId: number;

	interface Star {
		x: number;
		y: number;
		z: number;
		px: number;
		py: number;
		size: number;
		color: string;
		twinkle: number;
		twinkleSpeed: number;
	}

	const STAR_COLORS = [
		'255,255,255',
		'200,184,255',
		'167,139,250',
		'134,239,172',
		'110,231,183',
		'240,236,255'
	];

	let stars: Star[] = [];
	let mouseX = 0;
	let mouseY = 0;
	let scrollY = 0;
	let W = 0, H = 0;

	function initStars() {
		W = canvas.width = window.innerWidth;
		H = canvas.height = window.innerHeight;
		stars = [];
		const count = Math.min(Math.floor((W * H) / 4000), 400);
		for (let i = 0; i < count; i++) {
			stars.push({
				x: Math.random() * W - W / 2,
				y: Math.random() * H - H / 2,
				z: Math.random() * W,
				px: 0,
				py: 0,
				size: Math.random() * 1.5,
				color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
				twinkle: Math.random() * Math.PI * 2,
				twinkleSpeed: 0.02 + Math.random() * 0.03
			});
		}
	}

	function draw() {
		animId = requestAnimationFrame(draw);
		const ctx = canvas.getContext('2d')!;
		ctx.clearRect(0, 0, W, H);

		// parallax offset from mouse
		const ox = (mouseX / W - 0.5) * 30;
		const oy = (mouseY / H - 0.5) * 30 + scrollY * 0.05;

		for (const s of stars) {
			s.twinkle += s.twinkleSpeed;
			const brightness = 0.4 + 0.6 * Math.abs(Math.sin(s.twinkle));

			// perspective projection
			const sx = (s.x / s.z) * W + W / 2 + ox;
			const sy = (s.y / s.z) * H + H / 2 + oy;
			const r = Math.max(0.2, (1 - s.z / W) * 2.5 + s.size * 0.4);

			ctx.beginPath();
			ctx.arc(sx, sy, r, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(${s.color},${brightness * (1 - s.z / W)})`;
			ctx.fill();

			// subtle glow for brighter stars
			if (r > 1.2) {
				const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 4);
				grd.addColorStop(0, `rgba(${s.color},${brightness * 0.2})`);
				grd.addColorStop(1, 'transparent');
				ctx.fillStyle = grd;
				ctx.beginPath();
				ctx.arc(sx, sy, r * 4, 0, Math.PI * 2);
				ctx.fill();
			}
		}
	}

	onMount(() => {
		initStars();
		draw();

		function onMouseMove(e: MouseEvent) {
			mouseX = e.clientX;
			mouseY = e.clientY;
		}
		function onScroll() {
			scrollY = window.scrollY;
		}
		function onResize() {
			initStars();
		}

		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('scroll', onScroll);
		window.addEventListener('resize', onResize);

		return () => {
			cancelAnimationFrame(animId);
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onResize);
		};
	});
</script>

<canvas bind:this={canvas} class="star-field"></canvas>

<style>
	.star-field {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		z-index: 0;
		pointer-events: none;
	}
</style>
