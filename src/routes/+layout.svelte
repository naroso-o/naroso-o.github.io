<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import CosmicCursor from '$lib/components/common/CosmicCursor.svelte';

	function getParentPath(currentPath: string): string {
		const segments = currentPath.split('/').filter(Boolean);
		if (segments.length === 0) return '/';
		segments.pop();
		return segments.length === 0 ? '/' : '/' + segments.join('/');
	}

	function navigateBack() {
		goto(getParentPath($page.url.pathname));
	}

	function handleKeydown(event: KeyboardEvent) {
		const key = event.key.toLowerCase();
		const backspaceKeys = ['backspace', 'escape', 'esc'];
		if (backspaceKeys.includes(key) && $page.url.pathname !== '/') {
			event.preventDefault();
			navigateBack();
		}
	}

	onMount(() => window.addEventListener('keydown', handleKeydown));
	onDestroy(() => window.removeEventListener('keydown', handleKeydown));

	// Derived — is home page
	$: isHome = $page.url.pathname === '/';

	// Nav sections
	const navLinks = [
		{ href: '/about',   label: 'ABOUT'    },
		{ href: '/dev',     label: 'DEVLOG'   },
		{ href: '/blog',    label: 'JOURNALS' }
	];
</script>

<svelte:head>
	<meta name="theme-color" content="#04000f" />
</svelte:head>

<!-- Custom cursor (global) -->
<CosmicCursor />

<div class="layout-root" class:is-home={isHome}>

	<!-- Top navigation bar (hidden on home) -->
	{#if !isHome}
		<header class="site-header">
			<div class="header-inner">
				<!-- Back button -->
				{#if $page.url.pathname !== '/'}
					<button class="back-btn" onclick={navigateBack} aria-label="Go back">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
							stroke-linecap="round" stroke-linejoin="round">
							<path d="M19 12H5" /><path d="M12 19L5 12L12 5" />
						</svg>
					</button>
				{/if}

				<!-- Logo -->
				<a href="/" class="site-logo">
					<span class="logo-text">naroso-o</span>
					<span class="logo-dot"></span>
				</a>

				<!-- Nav links -->
				<nav class="nav-links">
					{#each navLinks as link}
						<a
							href={link.href}
							class="nav-link"
							class:active={$page.url.pathname.startsWith(link.href)}
						>
							{link.label}
						</a>
					{/each}
				</nav>

				<!-- Status pill -->
				<div class="status-pill">
					<span class="status-dot"></span>
					<span>ONLINE</span>
				</div>
			</div>

			<!-- Thin border line with gradient -->
			<div class="header-line"></div>
		</header>
	{/if}

	<!-- Main content -->
	<main class="main-content" class:has-header={!isHome}>
		<slot />
	</main>
</div>

<style>
	/* ── Root ── */
	.layout-root {
		width: 100%;
		min-height: 100vh;
		background: #04000f;
		overflow-x: hidden;
	}

	/* ── Header ── */
	.site-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		background: rgba(4, 0, 15, 0.75);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
	}

	.header-inner {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem 2rem;
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
	}

	.header-line {
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(124,58,237,0.4), rgba(74,222,128,0.2), transparent);
	}

	/* ── Back button ── */
	.back-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border: 1px solid rgba(124,58,237,0.3);
		border-radius: 50%;
		color: rgba(167,139,250,0.7);
		cursor: none;
		transition:
			border-color 0.3s ease,
			color 0.3s ease,
			background 0.3s ease;
		flex-shrink: 0;
	}
	.back-btn:hover {
		border-color: rgba(124,58,237,0.8);
		color: #a78bfa;
		background: rgba(124,58,237,0.1);
	}
	.back-btn svg {
		width: 14px;
		height: 14px;
	}

	/* ── Logo ── */
	.site-logo {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		text-decoration: none;
		margin-right: auto;
		cursor: none;
	}
	.logo-text {
		font-size: 0.9rem;
		letter-spacing: 0.15em;
		background: linear-gradient(135deg, #ffffff 0%, #a78bfa 60%, #4ade80 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	.logo-dot {
		width: 5px;
		height: 5px;
		background: #4ade80;
		border-radius: 50%;
		box-shadow: 0 0 6px #4ade80;
		animation: logoPulse 2s ease-in-out infinite;
	}
	@keyframes logoPulse {
		0%, 100% { opacity: 0.6; transform: scale(1); }
		50%       { opacity: 1;   transform: scale(1.3); }
	}

	/* ── Nav links ── */
	.nav-links {
		display: flex;
		gap: 0.25rem;
	}
	.nav-link {
		padding: 0.3rem 0.8rem;
		font-size: 0.65rem;
		letter-spacing: 0.18em;
		color: rgba(200,184,255,0.5);
		text-decoration: none;
		border: 1px solid transparent;
		border-radius: 2px;
		cursor: none;
		transition:
			color 0.25s ease,
			border-color 0.25s ease,
			background 0.25s ease;
	}
	.nav-link:hover,
	.nav-link.active {
		color: #a78bfa;
		border-color: rgba(124,58,237,0.35);
		background: rgba(124,58,237,0.08);
	}

	/* ── Status pill ── */
	.status-pill {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.25rem 0.6rem;
		border: 1px solid rgba(74,222,128,0.2);
		border-radius: 999px;
		font-size: 0.55rem;
		letter-spacing: 0.2em;
		color: rgba(74,222,128,0.5);
	}
	.status-dot {
		width: 4px;
		height: 4px;
		background: #4ade80;
		border-radius: 50%;
		box-shadow: 0 0 5px #4ade80;
		animation: statusBlink 2s ease-in-out infinite;
	}
	@keyframes statusBlink {
		0%, 100% { opacity: 1; }
		50%       { opacity: 0.3; }
	}

	/* ── Main content ── */
	.main-content {
		width: 100%;
		min-height: 100vh;
	}
	.main-content.has-header {
		padding-top: 60px; /* header height */
	}

	/* ── Mobile ── */
	@media (max-width: 768px) {
		.header-inner {
			padding: 0.75rem 1rem;
		}
		.nav-links {
			display: none;
		}
		.status-pill {
			display: none;
		}
	}
</style>
