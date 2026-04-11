<script lang="ts">
	import { onMount } from 'svelte';

	let visible = $state(false);
	let sectionVisible = $state<boolean[]>([false, false, false, false]);

	// Skill data
	const skills = [
		{ category: 'Frontend',  items: ['TypeScript', 'React', 'Svelte', 'Next.js', 'CSS / Tailwind'] },
		{ category: 'Backend',   items: ['Node.js', 'Go', 'Supabase', 'PostgreSQL', 'REST / GraphQL'] },
		{ category: 'Tooling',   items: ['Git', 'Docker', 'Vite', 'Vitest', 'CI / CD'] },
		{ category: 'Interests', items: ['UI/UX Design', 'Creative Coding', 'Open Source', 'Astronomy'] }
	];

	const timeline = [
		{ year: '2025', event: 'Building this cosmic archive ✦' },
		{ year: '2024', event: 'Deepened expertise in Svelte & SvelteKit' },
		{ year: '2023', event: 'Started writing about development journeys' },
		{ year: '2022', event: 'First open-source contribution' },
		{ year: '2021', event: 'Began professional software development' }
	];

	onMount(() => {
		visible = true;

		// Stagger section reveals on scroll
		const sections = document.querySelectorAll('.about-section');
		const obs = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const idx = Number((entry.target as HTMLElement).dataset.idx);
						sectionVisible[idx] = true;
					}
				});
			},
			{ threshold: 0.15 }
		);
		sections.forEach((s) => obs.observe(s));
		return () => obs.disconnect();
	});
</script>

<svelte:head>
	<title>About · naroso-o</title>
	<meta name="description" content="About naroso-o — developer, creator, explorer." />
</svelte:head>

<div class="about-page" class:visible>

	<!-- Hero / intro block -->
	<section class="about-hero about-section" data-idx="0"
		class:revealed={sectionVisible[0]}>
		<div class="hero-inner">
			<div class="hero-label">[ IDENTITY FILE ]</div>

			<div class="avatar-ring">
				<div class="avatar-core">
					<span class="avatar-char">N</span>
				</div>
				<div class="ring ring-1"></div>
				<div class="ring ring-2"></div>
				<div class="ring ring-3"></div>
			</div>

			<h1 class="hero-name">naroso-o</h1>
			<p class="hero-role">Software Developer · Creative Coder · Space Enthusiast</p>
			<div class="hero-divider"></div>
			<p class="hero-bio">
				A developer who treats code as a form of expression — carefully crafted records
				left behind in the digital cosmos. I build interfaces that feel alive and systems
				that breathe quietly in the background.
			</p>

			<div class="contact-row">
				<a href="https://github.com/naroso-o" target="_blank" rel="noopener" class="contact-link">
					<span class="link-icon">⌥</span> GitHub
				</a>
				<span class="contact-sep">·</span>
				<span class="contact-link muted">naroso-o@dev</span>
			</div>
		</div>
	</section>

	<!-- Skills section -->
	<section class="about-section skills-section" data-idx="1"
		class:revealed={sectionVisible[1]}>
		<div class="section-header">
			<span class="section-num">01</span>
			<h2>Skills & Tools</h2>
			<div class="section-line"></div>
		</div>

		<div class="skills-grid">
			{#each skills as skill, i}
				<div class="skill-card" style="animation-delay: {i * 0.1}s">
					<div class="skill-cat">{skill.category}</div>
					<ul class="skill-list">
						{#each skill.items as item}
							<li>
								<span class="skill-dot">◆</span>
								{item}
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</section>

	<!-- Timeline section -->
	<section class="about-section timeline-section" data-idx="2"
		class:revealed={sectionVisible[2]}>
		<div class="section-header">
			<span class="section-num">02</span>
			<h2>Coordinates in Time</h2>
			<div class="section-line"></div>
		</div>

		<div class="timeline">
			{#each timeline as item, i}
				<div class="timeline-item" style="animation-delay: {i * 0.12}s">
					<div class="tl-year">{item.year}</div>
					<div class="tl-connector">
						<div class="tl-dot"></div>
						{#if i < timeline.length - 1}
							<div class="tl-line"></div>
						{/if}
					</div>
					<div class="tl-event">{item.event}</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Philosophy section -->
	<section class="about-section philosophy-section" data-idx="3"
		class:revealed={sectionVisible[3]}>
		<div class="section-header">
			<span class="section-num">03</span>
			<h2>Signal in the Void</h2>
			<div class="section-line"></div>
		</div>

		<div class="philosophy-content">
			<blockquote class="philosophy-quote">
				"Every line of code is a signal sent into the void —
				<br />purposeful, hopeful, and quietly waiting to be received."
			</blockquote>
			<p class="philosophy-body">
				I believe the best software is written with the same care
				as a letter to someone you haven't met yet. This blog is
				both a development journal and a personal archive — a record
				that persists long after the moment passes.
			</p>
		</div>
	</section>

	<!-- Footer spacing -->
	<div class="about-footer">
		<div class="footer-sigil">✦</div>
		<p class="footer-note">End of file · Signal persists</p>
	</div>
</div>

<style>
	/* ── Page wrapper ── */
	.about-page {
		max-width: 860px;
		margin: 0 auto;
		padding: 3rem 2rem 6rem;
		min-height: 100vh;
		overflow-y: auto;
		overflow-x: hidden;
	}

	/* ── Section reveal ── */
	.about-section {
		opacity: 0;
		transform: translateY(28px);
		transition:
			opacity 0.8s cubic-bezier(0.16,1,0.3,1),
			transform 0.8s cubic-bezier(0.16,1,0.3,1);
		margin-bottom: 5rem;
	}
	.about-section.revealed {
		opacity: 1;
		transform: translateY(0);
	}

	/* ── Section headers ── */
	.section-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 2.5rem;
	}
	.section-num {
		font-size: 0.6rem;
		letter-spacing: 0.2em;
		color: rgba(74,222,128,0.5);
		font-family: monospace;
	}
	.section-header h2 {
		font-size: 1.1rem;
		letter-spacing: 0.15em;
		font-weight: 300;
		color: rgba(200,184,255,0.9);
		text-align: left;
		white-space: nowrap;
	}
	.section-line {
		flex: 1;
		height: 1px;
		background: linear-gradient(90deg, rgba(124,58,237,0.4), transparent);
	}

	/* ── Hero ── */
	.about-hero {
		text-align: center;
		padding-top: 1rem;
	}
	.hero-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}
	.hero-label {
		font-size: 0.6rem;
		letter-spacing: 0.35em;
		color: rgba(74,222,128,0.4);
		font-family: monospace;
	}

	/* Avatar ring animation */
	.avatar-ring {
		position: relative;
		width: 120px;
		height: 120px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.avatar-core {
		width: 72px;
		height: 72px;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(124,58,237,0.4) 0%, rgba(4,0,15,0.9) 70%);
		border: 1px solid rgba(124,58,237,0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2;
	}
	.avatar-char {
		font-size: 1.8rem;
		font-weight: 200;
		color: rgba(200,184,255,0.9);
	}
	.ring {
		position: absolute;
		border-radius: 50%;
		border: 1px solid;
		top: 50%; left: 50%;
		transform: translate(-50%, -50%);
	}
	.ring-1 {
		width: 88px; height: 88px;
		border-color: rgba(124,58,237,0.3);
		animation: ringRotate 6s linear infinite;
	}
	.ring-2 {
		width: 108px; height: 108px;
		border-color: rgba(74,222,128,0.15);
		animation: ringRotate 10s linear infinite reverse;
	}
	.ring-3 {
		width: 120px; height: 120px;
		border-color: rgba(167,139,250,0.1);
		animation: ringRotate 16s linear infinite;
	}
	@keyframes ringRotate {
		from { transform: translate(-50%,-50%) rotate(0deg); }
		to   { transform: translate(-50%,-50%) rotate(360deg); }
	}

	.hero-name {
		font-size: clamp(2rem, 5vw, 3.5rem);
		font-weight: 200;
		letter-spacing: 0.2em;
		background: linear-gradient(135deg, #fff 0%, #a78bfa 50%, #4ade80 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin: 0;
	}
	.hero-role {
		font-size: 0.75rem;
		letter-spacing: 0.18em;
		color: rgba(167,139,250,0.55);
		margin: 0;
		text-align: center;
	}
	.hero-divider {
		width: 60px;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(124,58,237,0.6), transparent);
		margin: 0.5rem auto;
	}
	.hero-bio {
		max-width: 540px;
		font-size: 0.9rem;
		line-height: 1.8;
		color: rgba(200,184,255,0.65);
		text-align: center;
	}
	.contact-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-top: 0.5rem;
	}
	.contact-link {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		color: rgba(167,139,250,0.7);
		text-decoration: none;
		cursor: none;
		transition: color 0.3s ease;
	}
	.contact-link:hover {
		color: #a78bfa;
	}
	.contact-link.muted {
		color: rgba(167,139,250,0.3);
	}
	.contact-sep {
		color: rgba(124,58,237,0.3);
	}
	.link-icon {
		font-size: 0.7rem;
	}

	/* ── Skills ── */
	.skills-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: 1rem;
	}
	.skill-card {
		padding: 1.25rem;
		border: 1px solid rgba(124,58,237,0.15);
		background: rgba(14,0,36,0.4);
		transition:
			border-color 0.3s ease,
			background 0.3s ease,
			transform 0.3s ease;
	}
	.skill-card:hover {
		border-color: rgba(124,58,237,0.4);
		background: rgba(124,58,237,0.06);
		transform: translateY(-2px);
	}
	.skill-cat {
		font-size: 0.6rem;
		letter-spacing: 0.22em;
		color: rgba(74,222,128,0.6);
		margin-bottom: 0.75rem;
		font-family: monospace;
	}
	.skill-list {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
	.skill-list li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.82rem;
		color: rgba(200,184,255,0.7);
	}
	.skill-dot {
		font-size: 0.4rem;
		color: rgba(124,58,237,0.6);
	}

	/* ── Timeline ── */
	.timeline {
		display: flex;
		flex-direction: column;
		gap: 0;
	}
	.timeline-item {
		display: grid;
		grid-template-columns: 60px 28px 1fr;
		align-items: start;
		gap: 1rem;
		opacity: 0;
		transform: translateX(-12px);
		transition:
			opacity 0.6s ease,
			transform 0.6s ease;
	}
	.about-section.revealed .timeline-item {
		opacity: 1;
		transform: translateX(0);
	}
	.tl-year {
		font-size: 0.7rem;
		font-family: monospace;
		color: rgba(74,222,128,0.5);
		padding-top: 0.1rem;
		text-align: right;
	}
	.tl-connector {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.tl-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: rgba(124,58,237,0.6);
		border: 1px solid rgba(124,58,237,0.9);
		box-shadow: 0 0 8px rgba(124,58,237,0.4);
		flex-shrink: 0;
	}
	.tl-line {
		width: 1px;
		flex: 1;
		min-height: 2.5rem;
		background: linear-gradient(180deg, rgba(124,58,237,0.4), rgba(124,58,237,0.05));
	}
	.tl-event {
		font-size: 0.85rem;
		color: rgba(200,184,255,0.7);
		padding-bottom: 2rem;
		line-height: 1.5;
	}

	/* ── Philosophy ── */
	.philosophy-content {
		max-width: 600px;
	}
	.philosophy-quote {
		font-size: 1rem;
		line-height: 1.9;
		color: rgba(200,184,255,0.8);
		border-left: 2px solid rgba(124,58,237,0.5);
		padding-left: 1.5rem;
		margin-bottom: 1.5rem;
		font-style: italic;
		font-weight: 300;
		quotes: none;
	}
	.philosophy-body {
		font-size: 0.85rem;
		line-height: 1.9;
		color: rgba(167,139,250,0.55);
		padding-left: 1.5rem;
	}

	/* ── Footer ── */
	.about-footer {
		text-align: center;
		padding: 3rem 0;
	}
	.footer-sigil {
		font-size: 1.2rem;
		color: rgba(124,58,237,0.4);
		margin-bottom: 0.5rem;
		animation: sigil 4s ease-in-out infinite;
	}
	@keyframes sigil {
		0%, 100% { opacity: 0.3; transform: scale(1); }
		50%       { opacity: 0.8; transform: scale(1.1); }
	}
	.footer-note {
		font-size: 0.6rem;
		letter-spacing: 0.25em;
		color: rgba(124,58,237,0.25);
	}

	/* ── Mobile ── */
	@media (max-width: 640px) {
		.about-page { padding: 2rem 1rem 5rem; }
		.skills-grid { grid-template-columns: repeat(2, 1fr); }
		.timeline-item { grid-template-columns: 48px 24px 1fr; gap: 0.6rem; }
	}
</style>
