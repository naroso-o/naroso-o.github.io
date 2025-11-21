<script lang="ts">
	let menuItems = [
		{
			label: 'POSTS',
			href: 'dev'
		},
		{
			label: 'BLOGS',
			href: 'blog'
		}
	];

	let selectedMenu = $state<{ label: string; href: string }>(menuItems[0]);
	let selectedIndex = $state(0);

	selectedMenu = menuItems[0];

	function handleKeydown(event: KeyboardEvent) {
		const key = event.key.toLowerCase();

		if (key === 'arrowup' || key === 'w') {
			event.preventDefault();
			selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : menuItems.length - 1;
			selectedMenu = menuItems[selectedIndex];
		} else if (key === 'arrowdown' || key === 's') {
			event.preventDefault();
			selectedIndex = selectedIndex < menuItems.length - 1 ? selectedIndex + 1 : 0;
			selectedMenu = menuItems[selectedIndex];
		} else if (key === 'enter' || key === ' ') {
			event.preventDefault();
			window.location.href = selectedMenu.href;
		}
	}

	function handleMenuHover(index: number) {
		selectedIndex = index;
		selectedMenu = menuItems[index];
	}
</script>

<svelte:head>
	<title>naroso-o 개발 로그</title>
	<meta name="description" content="developer naroso-o's blog" />
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

<div class="main-wrapper">
	<div class="content-container">
		<div class="title-container">
			<h1>Pixel Journal</h1>
		</div>
		<div class="menu-container">
			{#each menuItems as item, index}
				<div
					class="menu-item"
					onmouseenter={() => handleMenuHover(index)}
					role="button"
					tabindex="-1"
				>
					<div class="triangle-icon" class:active={selectedMenu.label === item.label}></div>
					<a href={`/${item.href}`} class:active={selectedMenu.label === item.label}>{item.label}</a
					>
				</div>
			{/each}
		</div>
	</div>

	<footer class="footer-container">
		<div>© copyright 2025 naroso-o. All rights reserved.</div>
	</footer>
</div>

<style>
	.main-wrapper {
		display: flex;
		height: 100%;
		flex-direction: column;
		align-items: center;
	}

	.content-container {
		display: flex;
		height: 100%;
		flex-direction: column;
		justify-content: start;
		align-items: center;
		box-sizing: border-box;
	}

	.title-container {
		padding: 4rem;
	}

	.menu-container {
		display: flex;
		width: fit-content;
		flex-direction: column;
		padding: 2rem 4rem 2rem 2rem;
		gap: 1rem;

		background-color: #000;
		border: 4px solid #1d1618;
		filter: blur(0.5px);
	}

	.footer-container {
		filter: blur(0.5px);
	}

	.menu-item {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.menu-item a {
		font-size: 1.5rem;
		text-decoration: none;
		color: #fff;
		filter: blur(0.5px);
	}

	.menu-item a.active {
		color: #f7d022;
	}

	.triangle-icon {
		width: 0;
		height: 0;
		border-left: 10px solid transparent;
		border-right: 10px solid transparent;
		border-bottom: 10px solid #f7d022;
		transform: rotate(90deg);
		opacity: 0;
		filter: blur(1px);
		transition: opacity 0.2s ease;
	}

	.triangle-icon.active {
		opacity: 1;
	}

	h1 {
		color: #f7d022;
		filter: blur(1px);
	}
</style>
