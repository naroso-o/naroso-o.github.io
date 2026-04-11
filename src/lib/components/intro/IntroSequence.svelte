<script lang="ts">
	import { onMount } from 'svelte';

	let { onComplete }: { onComplete?: () => void } = $props();

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let animationId: number;
	let phase = $state<'vibrate' | 'explode' | 'sparkle' | 'gather' | 'text' | 'noise' | 'done'>(
		'vibrate'
	);
	let phaseTime = 0;

	// ── Particle types ──────────────────────────────────────────────
	interface Spark {
		x: number;
		y: number;
		vx: number;
		vy: number;
		life: number;
		maxLife: number;
		size: number;
		color: string;
		trail: { x: number; y: number }[];
		angle: number;
		speed: number;
		gatherX: number;
		gatherY: number;
		gathered: boolean;
	}

	const SPARK_COLORS = [
		'#ffffff',
		'#c8b8ff',
		'#a78bfa',
		'#7c3aed',
		'#4ade80',
		'#86efac',
		'#ddd6fe',
		'#ede9fe',
		'#6ee7b7'
	];

	let sparks: Spark[] = [];
	let cx = 0,
		cy = 0;
	let dotRadius = 0; // animated dot radius
	let dotPhase = 0; // vibrate phase offset

	// noise-text
	const NOISE_CHARS =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*!?';
	const TARGET_TEXT = 'Test . . .';
	let displayText = $state('');
	let noiseProgress = 0;
	let noiseTimer = 0;

	// scanline / vignette overlay opacity
	let overlayAlpha = $state(0);
	let finalAlpha = $state(0); // fade out entire intro

	function resize() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		cx = canvas.width / 2;
		cy = canvas.height / 2;
	}

	function randomChar() {
		return NOISE_CHARS[Math.floor(Math.random() * NOISE_CHARS.length)];
	}

	function spawnSparks() {
		const count = 220;
		sparks = [];
		for (let i = 0; i < count; i++) {
			const angle = Math.random() * Math.PI * 2;
			const speed = 2 + Math.random() * 14;
			const maxLife = 90 + Math.random() * 60;
			const color = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];
			sparks.push({
				x: cx,
				y: cy,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed,
				life: maxLife,
				maxLife,
				size: 0.8 + Math.random() * 2.5,
				color,
				trail: [],
				angle,
				speed,
				gatherX: cx,
				gatherY: cy,
				gathered: false
			});
		}
	}

	// ── Main draw loop ────────────────────────────────────────────────
	function draw(timestamp: number) {
		animationId = requestAnimationFrame(draw);
		if (!ctx) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// deep space BG gradient
		const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(canvas.width, canvas.height));
		bg.addColorStop(0, '#0a0010');
		bg.addColorStop(0.5, '#050015');
		bg.addColorStop(1, '#000000');
		ctx.fillStyle = bg;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		phaseTime++;

		// ── PHASE: vibrate ──────────────────────────────────────────
		if (phase === 'vibrate') {
			dotPhase += 0.18;
			const pulse = Math.sin(dotPhase) * 3;
			dotRadius = 8 + pulse;

			// glow layers
			for (let g = 3; g >= 1; g--) {
				const glowR = dotRadius * (1 + g * 0.9);
				const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
				grad.addColorStop(0, `rgba(255,255,255,${0.15 / g})`);
				grad.addColorStop(1, 'transparent');
				ctx.fillStyle = grad;
				ctx.beginPath();
				ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
				ctx.fill();
			}

			ctx.beginPath();
			ctx.arc(cx, cy, dotRadius, 0, Math.PI * 2);
			ctx.fillStyle = '#ffffff';
			ctx.fill();

			if (phaseTime > 90) {
				phaseTime = 0;
				phase = 'explode';
				spawnSparks();
			}
		}

		// ── PHASE: explode ──────────────────────────────────────────
		else if (phase === 'explode' || phase === 'sparkle') {
			if (phase === 'explode' && phaseTime > 18) {
				phaseTime = 0;
				phase = 'sparkle';
			}

			// expand shockwave ring
			if (phase === 'explode') {
				const ringR = phaseTime * 28;
				ctx.beginPath();
				ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
				ctx.strokeStyle = `rgba(200,184,255,${0.7 * (1 - phaseTime / 18)})`;
				ctx.lineWidth = 4 - phaseTime * 0.15;
				ctx.stroke();
			}

			// update + draw sparks
			let allDead = true;
			for (const s of sparks) {
				s.trail.push({ x: s.x, y: s.y });
				if (s.trail.length > 12) s.trail.shift();

				s.vx *= 0.97;
				s.vy *= 0.97;
				s.vy += 0.04; // subtle gravity
				s.x += s.vx;
				s.y += s.vy;
				s.life--;

				if (s.life > 0) {
					allDead = false;

					// trail
					for (let t = 0; t < s.trail.length; t++) {
						const alpha = (t / s.trail.length) * (s.life / s.maxLife) * 0.6;
						ctx.beginPath();
						ctx.arc(s.trail[t].x, s.trail[t].y, s.size * (t / s.trail.length), 0, Math.PI * 2);
						ctx.fillStyle = s.color.replace(')', `,${alpha})`).replace('rgb', 'rgba');
						// handle hex colors
						ctx.globalAlpha = alpha;
						ctx.fillStyle = s.color;
						ctx.fill();
						ctx.globalAlpha = 1;
					}

					// head glow
					const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 3);
					grd.addColorStop(0, s.color);
					grd.addColorStop(1, 'transparent');
					ctx.globalAlpha = s.life / s.maxLife;
					ctx.fillStyle = grd;
					ctx.beginPath();
					ctx.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2);
					ctx.fill();
					ctx.globalAlpha = 1;
				}
			}

			if (allDead && phase === 'sparkle') {
				phaseTime = 0;
				phase = 'gather';
				// reset sparks for gather
				sparks = sparks.map((s) => ({
					...s,
					x: s.x,
					y: s.y,
					life: 80,
					maxLife: 80,
					gathered: false
				}));
			}
		}

		// ── PHASE: gather ───────────────────────────────────────────
		else if (phase === 'gather') {
			let allGathered = true;
			for (const s of sparks) {
				const dx = cx - s.x;
				const dy = cy - s.y;
				const dist = Math.sqrt(dx * dx + dy * dy);

				if (dist > 3) {
					allGathered = false;
					s.x += dx * 0.07;
					s.y += dy * 0.07;
				} else {
					s.gathered = true;
				}

				const alpha = Math.min(1, dist / 60);
				ctx.globalAlpha = alpha * 0.85;
				ctx.beginPath();
				ctx.arc(s.x, s.y, s.size * 0.8, 0, Math.PI * 2);
				ctx.fillStyle = s.color;
				ctx.fill();
				ctx.globalAlpha = 1;
			}

			// Draw gathering core glow
			const glowSize = phaseTime * 0.5 + 4;
			const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowSize);
			grd.addColorStop(0, 'rgba(255,255,255,0.9)');
			grd.addColorStop(0.4, 'rgba(167,139,250,0.4)');
			grd.addColorStop(1, 'transparent');
			ctx.fillStyle = grd;
			ctx.beginPath();
			ctx.arc(cx, cy, glowSize, 0, Math.PI * 2);
			ctx.fill();

			if (allGathered || phaseTime > 80) {
				phaseTime = 0;
				phase = 'text';
				noiseProgress = 0;
				noiseTimer = 0;
				displayText = Array.from(TARGET_TEXT)
					.map((c) => (c === ' ' ? ' ' : randomChar()))
					.join('');
			}
		}

		// ── PHASE: text / noise ─────────────────────────────────────
		else if (phase === 'text' || phase === 'noise') {
			if (phase === 'text') phaseTime = 0;
			if (phase !== 'noise') phase = 'noise';

			noiseTimer++;
			overlayAlpha = Math.min(0.6, noiseTimer * 0.015);

			// Resolve chars one by one
			if (noiseTimer % 4 === 0 && noiseProgress < TARGET_TEXT.length) {
				noiseProgress++;
				displayText = TARGET_TEXT.slice(0, noiseProgress)
					+ Array.from(TARGET_TEXT.slice(noiseProgress))
						.map((c) => (c === ' ' ? ' ' : randomChar()))
						.join('');
			} else if (noiseProgress < TARGET_TEXT.length) {
				// scramble remaining
				displayText = TARGET_TEXT.slice(0, noiseProgress)
					+ Array.from(TARGET_TEXT.slice(noiseProgress))
						.map((c) => (c === ' ' ? ' ' : randomChar()))
						.join('');
			}

			if (noiseProgress >= TARGET_TEXT.length && noiseTimer > 80) {
				// display is TARGET_TEXT but add random flicker
				if (Math.random() < 0.12) {
					const idx = Math.floor(Math.random() * TARGET_TEXT.length);
					const arr = TARGET_TEXT.split('');
					if (arr[idx] !== ' ') arr[idx] = randomChar();
					displayText = arr.join('');
				} else {
					displayText = TARGET_TEXT;
				}
			}

			// Draw text on canvas
			const fontSize = Math.min(canvas.width * 0.08, 96);
			ctx.font = `300 ${fontSize}px 'Orbit', monospace`;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';

			// glow layers
			ctx.shadowBlur = 40;
			ctx.shadowColor = '#a78bfa';
			ctx.fillStyle = '#ffffff';
			ctx.globalAlpha = 0.15;
			ctx.fillText(displayText, cx, cy);

			ctx.shadowBlur = 20;
			ctx.globalAlpha = 0.4;
			ctx.fillText(displayText, cx, cy);

			ctx.shadowBlur = 0;
			ctx.globalAlpha = 1;
			ctx.fillStyle = '#f0ecff';
			ctx.fillText(displayText, cx, cy);

			// scanline noise overlay
			ctx.globalAlpha = overlayAlpha * 0.5;
			for (let y = 0; y < canvas.height; y += 4) {
				if (Math.random() < 0.15) {
					ctx.fillStyle = `rgba(167,139,250,${Math.random() * 0.08})`;
					ctx.fillRect(0, y, canvas.width, 2);
				}
			}
			ctx.globalAlpha = 1;

			// random pixel noise near text
			for (let n = 0; n < 40; n++) {
				const nx = cx + (Math.random() - 0.5) * fontSize * TARGET_TEXT.length * 0.7;
				const ny = cy + (Math.random() - 0.5) * fontSize * 1.2;
				ctx.fillStyle = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];
				ctx.globalAlpha = Math.random() * 0.4;
				ctx.fillRect(nx, ny, 1, 1);
			}
			ctx.globalAlpha = 1;

			if (noiseTimer > 160) {
				phase = 'done';
				// fade out
				setTimeout(() => {
					onComplete?.();
				}, 900);
			}
		}

		// ── PHASE: done — fade canvas out ───────────────────────────
		else if (phase === 'done') {
			finalAlpha = Math.min(1, finalAlpha + 0.018);
			ctx.fillStyle = `rgba(0,0,0,${finalAlpha})`;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			if (finalAlpha >= 1) {
				cancelAnimationFrame(animationId);
			}
		}
	}

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		resize();
		window.addEventListener('resize', resize);
		animationId = requestAnimationFrame(draw);
		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener('resize', resize);
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="intro-canvas"
	style="opacity: {phase === 'done' ? Math.max(0, 1 - finalAlpha * 2) : 1}"
></canvas>

<style>
	.intro-canvas {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		z-index: 9999;
		cursor: none;
		background: #000;
		transition: opacity 0.5s ease;
	}
</style>
