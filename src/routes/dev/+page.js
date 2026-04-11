import { postService } from '$lib/pocketbase.js';

export async function load({ url }) {
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 10;
	const offset = (page - 1) * limit;

	try {
		const [posts, allTags] = await Promise.all([
			postService.getPosts(limit, offset),
			postService.getAllTags()
		]);

		return {
			posts,
			allTags,
			currentPage: page,
			hasMore: posts.length === limit
		};
	} catch (err) {
		console.error('Error loading posts:', err);
		return {
			posts: [],
			allTags: [],
			currentPage: 1,
			hasMore: false
		};
	}
}
