<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import IntroSequence from '$lib/components/intro/IntroSequence.svelte';
	import StarField from '$lib/components/home/StarField.svelte';
	import NebulaBackground from '$lib/components/home/NebulaBackground.svelte';

	// ── State ──────────────────────────────────────────────────────
	let introComplete = $state(false);
	let contentVisible = $state(false);
	let mounted = $state(false);

	// Mouse parallax
	let mouseX = $state(0);
	let mouseY = $state(0);
	let scrollProgress = $state(0);

	// Menu
	const menuItems = [
		{ label: 'ABOUT',    sublabel: 'Who I am',        href: '/about',  icon: '◈' },
		{ label: 'DEVLOG',   sublabel: 'Tech Chronicles', href: '/dev',    icon: '◉' },
		{ label: 'JOURNALS', sublabel: 'Daily Logs',      href: '/blog',   icon: '◎' }
	];
	let hoveredIndex = $state(-1);
	let selectedIndex = $state(0);

	// Floating particles (CSS-only, created on mount)
	interface Particle {
		id: number;
		x: number;
		y: number;
		size: number;
		duration: number;
		delay: number;
		color: string;
	}
	let particles: Particle[] = $state([]);

	const PARTICLE_COLORS = [
		'rgba(124,58,237,0.7)',
		'rgba(167,139,250,0.5)',
		'rgba(74,222,128,0.5)',
		'rgba(200,184,255,0.4)',
		'rgba(255,255,255,0.3)'
	];

	// ── Intro complete handler ─────────────────────────────────────
	function handleIntroComplete() {
		introComplete = true;
		setTimeout(() => (contentVisible = true), 100);
	}

	// ── Keyboard nav ──────────────────────────────────────────────
	function handleKeydown(e: KeyboardEvent) {
		if (!contentVisible) return;
		const key = e.key.toLowerCase();
		if (key === 'arrowup' || key === 'w') {
			e.preventDefault();
			selectedIndex = (selectedIndex - 1 + menuItems.length) % menuItems.length;
		} else if (key === 'arrowdown' || key === 's') {
			e.preventDefault();
			selectedIndex = (selectedIndex + 1) % menuItems.length;
		} else if (key === 'enter' || key === ' ') {
			e.preventDefault();
			goto(menuItems[selectedIndex].href);
		}
	}

	onMount(() => {
		mounted = true;

		// Generate floating particles
		particles = Array.from({ length: 40 }, (_, i) => ({
			id: i,
			x: Math.random() * 100,
			y: Math.random() * 100,
			size: 1 + Math.random() * 3,
			duration: 8 + Math.random() * 16,
			delay: Math.random() * 8,
			color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)]
		}));

		function onMouseMove(e: MouseEvent) {
			mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
			mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
		}
		function onScroll() {
			scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
		}

		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('scroll', onScroll);
		window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<svelte:head>
	<title>naroso-o · Cosmic Archive</title>
	<meta name="description" content="A record left in the cosmos — naroso-o's developer blog" />
</svelte:head>

<!-- Intro Sequence -->
{#if !introComplete}
	<IntroSequence onComplete={handleIntroComplete} />
{/if}

<!-- Background layers (always rendered so they're ready) -->
{#if mounted}
	<StarField />
	<NebulaBackground />
{/if}

<!-- Floating dust particles -->
{#each particles as p (p.id)}
	<div
		class="particle"
		style="
      left: {p.x}%;
      top: {p.y}%;
      width: {p.size}px;
      height: {p.size}px;
      background: {p.color};
      animation-duration: {p.duration}s;
      animation-delay: -{p.delay}s;
    "
	></div>
{/each}

<!-- Main content -->
{#if contentVisible}
	<div
		class="home-wrapper"
		style="
      --mx: {mouseX};
      --my: {mouseY};
    "
	>
		<!-- Top constellation line decoration -->
		<div class="constellation-line top-line" style="opacity: {contentVisible ? 1 : 0}"></div>

		<!-- Center content -->
		<div class="center-content">

			<!-- Title area -->
			<div
				class="title-area"
				style="transform: translate({mouseX * -12}px, {mouseY * -8}px)"
			>
				<div class="site-label">COSMIC ARCHIVE</div>
				<h1 class="site-title">
					<span class="title-main">naroso-o</span>
				</h1>
				<p class="site-tagline">A record left in the cosmos</p>

				<!-- Decorative coordinate -->
				<div class="coord-display">
					<span>RA {(mouseX * 12 + 182.5).toFixed(2)}°</span>
					<span class="coord-sep">·</span>
					<span>DEC {(mouseY * 8 + 39.1).toFixed(2)}°</span>
				</div>
			</div>

			<!-- Menu -->
			<nav
				class="menu-nav"
				style="transform: translate({mouseX * 6}px, {mouseY * 4}px)"
			>
				{#each menuItems as item, i}
					<a
						href={item.href}
						class="menu-item"
						class:hovered={hoveredIndex === i}
						class:selected={selectedIndex === i && hoveredIndex === -1}
						style="animation-delay: {0.1 + i * 0.12}s"
						onmouseenter={() => { hoveredIndex = i; selectedIndex = i; }}
						onmouseleave={() => { hoveredIndex = -1; }}
					>
						<span class="item-icon">{item.icon}</span>
						<span class="item-body">
							<span class="item-label">{item.label}</span>
							<span class="item-sub">{item.sublabel}</span>
						</span>
						<span class="item-arrow">→</span>

						<!-- hover glow bar -->
						<span class="item-glow"></span>
					</a>
				{/each}
			</nav>

			<!-- Keyboard hint -->
			<div class="key-hint">
				<kbd>↑↓</kbd> to navigate &nbsp;·&nbsp; <kbd>↵</kbd> to enter
			</div>
		</div>

		<!-- Bottom ornament -->
		<div class="bottom-ornament">
			<span class="scroll-hint">
				<span class="scroll-dot"></span>
				SCROLL
			</span>
			<span class="copyright">© 2025 naroso-o</span>
		</div>

		<!-- Constellation line decoration -->
		<div class="constellation-line bottom-line"></div>

		<!-- Corner coordinates -->
		<div class="corner corner-tl">0x0000</div>
		<div class="corner corner-tr">SYS.ONLINE</div>
		<div class="corner corner-bl">SECTOR-7G</div>
		<div class="corner corner-br">v2.0</div>
	</div>
{/if}

<style>
	/* ── Floating particles ── */
	.particle {
		position: fixed;
		border-radius: 50%;
		pointer-events: none;
		z-index: 2;
		animation: floatUp linear infinite;
	}

	@keyframes floatUp {
		0%   { transform: translateY(0) scale(1);   opacity: 0; }
		10%  { opacity: 1; }
		90%  { opacity: 0.6; }
		100% { transform: translateY(-120vh) scale(0.3); opacity: 0; }
	}

	/* ── Home wrapper ── */
	.home-wrapper {
		position: relative;
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		z-index: 10;
		overflow: hidden;
		padding: 2rem;
	}

	/* ── Constellation lines ── */
	.constellation-line {
		width: 60%;
		height: 1px;
		position: relative;
		overflow: visible;
	}
	.constellation-line::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(90deg, transparent, rgba(124,58,237,0.5), rgba(74,222,128,0.3), transparent);
		animation: lineShimmer 4s ease-in-out infinite;
	}
	.constellation-line::after {
		content: '◆';
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		font-size: 0.5rem;
		color: rgba(167,139,250,0.7);
		animation: pulse 3s ease-in-out infinite;
	}
	@keyframes lineShimmer {
		0%, 100% { opacity: 0.4; }
		50%       { opacity: 1; }
	}
	@keyframes pulse {
		0%, 100% { transform: translate(-50%, -50%) scale(1);   opacity: 0.5; }
		50%       { transform: translate(-50%, -50%) scale(1.5); opacity: 1; }
	}

	/* ── Center content ── */
	.center-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3rem;
		z-index: 10;
		flex: 1;
		justify-content: center;
		animation: fadeIn 0.8s var(--ease-cosmic, cubic-bezier(0.16,1,0.3,1)) both;
	}
	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(20px); }
		to   { opacity: 1; transform: translateY(0); }
	}

	/* ── Title area ── */
	.title-area {
		text-align: center;
		transition: transform 0.1s linear;
	}
	.site-label {
		font-size: 0.65rem;
		letter-spacing: 0.4em;
		color: rgba(167,139,250,0.6);
		margin-bottom: 0.5rem;
		animation: fadeIn 0.6s 0.2s both;
	}
	.site-title {
		font-size: clamp(3rem, 8vw, 6rem);
		font-weight: 200;
		letter-spacing: 0.12em;
		line-height: 1;
		margin: 0;
		animation: fadeIn 0.8s 0.3s both;
	}
	.title-main {
		background: linear-gradient(135deg, #ffffff 0%, #a78bfa 40%, #4ade80 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		filter: drop-shadow(0 0 20px rgba(124,58,237,0.4));
	}
	.site-tagline {
		font-size: 0.85rem;
		letter-spacing: 0.2em;
		color: rgba(200,184,255,0.5);
		margin-top: 0.75rem;
		animation: fadeIn 0.6s 0.5s both;
	}
	.coord-display {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
		margin-top: 0.5rem;
		font-size: 0.65rem;
		font-family: monospace;
		color: rgba(74,222,128,0.4);
		letter-spacing: 0.1em;
		animation: fadeIn 0.6s 0.6s both;
	}
	.coord-sep { opacity: 0.4; }

	/* ── Menu nav ── */
	.menu-nav {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		width: min(420px, 90vw);
		transition: transform 0.1s linear;
		animation: fadeIn 0.8s 0.4s both;
	}
	.menu-item {
		position: relative;
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.8rem 1.2rem;
		border: 1px solid rgba(124,58,237,0.2);
		border-radius: 2px;
		text-decoration: none;
		color: rgba(200,184,255,0.7);
		overflow: hidden;
		transition:
			border-color 0.3s ease,
			color 0.3s ease,
			transform 0.3s var(--ease-cosmic, cubic-bezier(0.16,1,0.3,1));
		cursor: none;
	}
	.menu-item.hovered,
	.menu-item.selected {
		border-color: rgba(124,58,237,0.7);
		color: #ffffff;
		transform: translateX(6px);
	}
	.menu-item.hovered .item-glow,
	.menu-item.selected .item-glow {
		opacity: 1;
	}
	.item-glow {
		position: absolute;
		inset: 0;
		background: linear-gradient(90deg, rgba(124,58,237,0.15), rgba(74,222,128,0.05));
		opacity: 0;
		transition: opacity 0.3s ease;
		pointer-events: none;
	}
	.item-icon {
		font-size: 1rem;
		color: rgba(167,139,250,0.6);
		transition: color 0.3s ease;
		flex-shrink: 0;
	}
	.menu-item.hovered .item-icon,
	.menu-item.selected .item-icon {
		color: #a78bfa;
	}
	.item-body {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}
	.item-label {
		font-size: 0.9rem;
		letter-spacing: 0.18em;
		font-weight: 400;
	}
	.item-sub {
		font-size: 0.65rem;
		letter-spacing: 0.1em;
		color: rgba(167,139,250,0.4);
		transition: color 0.3s ease;
	}
	.menu-item.hovered .item-sub,
	.menu-item.selected .item-sub {
		color: rgba(74,222,128,0.6);
	}
	.item-arrow {
		font-size: 0.8rem;
		opacity: 0;
		transform: translateX(-6px);
		transition:
			opacity 0.3s ease,
			transform 0.3s ease;
		color: #4ade80;
	}
	.menu-item.hovered .item-arrow,
	.menu-item.selected .item-arrow {
		opacity: 1;
		transform: translateX(0);
	}

	/* ── Keyboard hint ── */
	.key-hint {
		font-size: 0.6rem;
		letter-spacing: 0.12em;
		color: rgba(167,139,250,0.3);
		animation: fadeIn 0.6s 0.8s both;
	}
	kbd {
		display: inline-block;
		padding: 0.1em 0.35em;
		border: 1px solid rgba(167,139,250,0.3);
		border-radius: 2px;
		font-size: 0.6rem;
		color: rgba(167,139,250,0.5);
	}

	/* ── Bottom ornament ── */
	.bottom-ornament {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		z-index: 10;
		animation: fadeIn 1s 0.6s both;
	}
	.scroll-hint {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.6rem;
		letter-spacing: 0.2em;
		color: rgba(167,139,250,0.3);
	}
	.scroll-dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: rgba(124,58,237,0.6);
		animation: scrollPulse 2s ease-in-out infinite;
	}
	@keyframes scrollPulse {
		0%, 100% { transform: scale(1);   opacity: 0.4; }
		50%       { transform: scale(1.5); opacity: 1; }
	}
	.copyright {
		font-size: 0.6rem;
		letter-spacing: 0.1em;
		color: rgba(167,139,250,0.2);
	}

	/* ── Corner labels ── */
	.corner {
		position: fixed;
		font-size: 0.55rem;
		letter-spacing: 0.15em;
		color: rgba(124,58,237,0.3);
		font-family: monospace;
		animation: fadeIn 1s 0.8s both;
	}
	.corner-tl { top: 1rem;  left: 1rem; }
	.corner-tr { top: 1rem;  right: 1rem; }
	.corner-bl { bottom: 1rem; left: 1rem; }
	.corner-br { bottom: 1rem; right: 1rem; }

	/* ── Mobile ── */
	@media (max-width: 768px) {
		.home-wrapper { padding: 1rem; }
		.coord-display { display: none; }
		.key-hint { display: none; }
		.corner { display: none; }
	}
</style>
