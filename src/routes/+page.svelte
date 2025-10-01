<script lang="ts">
	import { base } from '$app/paths';
	import PostCard from '$lib/components/dev-log/PostCard.svelte';
	import type { Post } from '$lib/types';
	import NoPostMessage from '../lib/components/common/NoPostMessage.svelte';

	// 서버에서 받은 데이터
	export let data: {
		recentPosts: Post[];
		featuredPosts: Post[];
	};

	$: ({ recentPosts, featuredPosts } = data);

	const handleClick = () => {
		const button = document.querySelector('.particleButton');

		Array.from({ length: 5 }).forEach(() => {
			const particle = document.createElement('span');
			particle.classList.add('particle');
			particle.style.top = Math.random() * 100 + '%';
			particle.style.left = Math.random() * 100 + '%';

			button.appendChild(particle);
		});
	};
</script>

<svelte:head>
	<title>naroso-o.blog</title>
	<meta name="description" content="developer naroso-o's blog" />
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-8">
	<div class="flex justify-center">
		<button class="particleButton" on:click={handleClick}>
			<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
				<path
					d="M3.68546 5.43796C8.61936 1.29159 11.8685 7.4309 12.0406 7.4309C12.2126 7.43091 15.4617 1.29159 20.3956 5.43796C26.8941 10.8991 13.5 21.8215 12.0406 21.8215C10.5811 21.8215 -2.81297 10.8991 3.68546 5.43796Z"
					stroke="white"
					stroke-width="2"
					stroke-linecap="round"
				/>
			</svg>
			<span class="visually-hidden">Welcome Effect Button</span>
		</button>
	</div>
</div>

<style>
	@keyframes fadeOut {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}

	.particleButton .particle {
		position: absolute;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: white;
		animation: fadeOut 1000ms forwards;
	}
</style>
