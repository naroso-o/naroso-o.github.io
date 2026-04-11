import PocketBase from 'pocketbase';

const PB_URL = import.meta.env.VITE_PB_URL;

export const pb = new PocketBase(PB_URL || 'https://example.fly.dev');

export const postService = {
	async getPosts(limit = 10, offset = 0) {
		const page = Math.floor(offset / limit) + 1;
		const result = await pb.collection('posts').getList(page, limit, {
			filter: 'status = "published"',
			sort: '-published_at',
			fields: 'id,title,slug,excerpt,tags,created,published_at,view_count,featured,thumbnail'
		});
		return result.items;
	},

	async getPostBySlug(/** @type {string} */ slug) {
		return await pb
			.collection('posts')
			.getFirstListItem(`slug = "${slug}" && status = "published"`);
	},

	async getFeaturedPosts(limit = 3) {
		const result = await pb.collection('posts').getList(1, limit, {
			filter: 'status = "published" && featured = true',
			sort: '-published_at',
			fields: 'id,title,slug,excerpt,tags,created,published_at'
		});
		return result.items;
	},

	async getAllTags() {
		const result = await pb.collection('posts').getFullList({
			filter: 'status = "published"',
			fields: 'tags'
		});
		const allTags = result.flatMap((post) => post.tags || []);
		return [...new Set(allTags)].sort();
	},

	async createPost(/** @type {Record<string, any>} */ postData) {
		const slug = postData.title
			.toLowerCase()
			.replace(/[^a-z0-9가-힣\s]/g, '')
			.replace(/\s+/g, '-')
			.trim();

		return await pb.collection('posts').create({
			title: postData.title,
			content: postData.content,
			slug,
			excerpt: postData.content.substring(0, 150) + '...',
			tags: postData.tags || [],
			status: 'published',
			published_at: postData.published_at || new Date().toISOString(),
			view_count: 0,
			featured: false
		});
	},

	async updatePost(/** @type {string} */ id, /** @type {Record<string, any>} */ postData) {
		return await pb.collection('posts').update(id, postData);
	},

	async deletePost(/** @type {string} */ id) {
		return await pb.collection('posts').delete(id);
	}
};
