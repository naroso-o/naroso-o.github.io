import { json } from '@sveltejs/kit';
import { postService } from '$lib/pocketbase.js';

export async function GET({ url }) {
	try {
		const limit = parseInt(url.searchParams.get('limit') || '5');
		const featured = url.searchParams.get('featured') === 'true';

		const posts = featured
			? await postService.getFeaturedPosts(limit)
			: await postService.getPosts(limit, 0);

		const formattedPosts = posts.map((post) => ({
			...post,
			date: new Date(post.published_at || post.created).toLocaleDateString('ko-KR', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})
		}));

		return json(formattedPosts);
	} catch (err) {
		console.error('API Error:', err);
		return json({ error: '포스트를 불러오는 중 오류가 발생했습니다.' }, { status: 500 });
	}
}

export async function POST({ request }) {
	try {
		const { title, content } = await request.json();

		if (!title?.trim() || !content?.trim()) {
			return json({ error: '제목과 내용은 필수입니다.' }, { status: 400 });
		}

		const newPost = await postService.createPost({
			title: title.trim(),
			content: content.trim(),
			published_at: new Date().toISOString()
		});

		return json({ success: true, post: newPost });
	} catch (err) {
		console.error('POST API Error:', err);
		return json({ error: '포스트 저장 중 오류가 발생했습니다.' }, { status: 500 });
	}
}
