import { http, HttpResponse } from 'msw';
import { mockPosts } from './fixtures/supabase-mock';

// Supabase URL
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;

export const handlers = [
	// Supabase REST API 모킹 (서버사이드)
	// Posts 테이블 조회
	http.get(`${SUPABASE_URL}/rest/v1/pieces`, ({ request }) => {
		const url = new URL(request.url);
		const limit = parseInt(url.searchParams.get('limit') || '10');
		const offset = parseInt(url.searchParams.get('offset') || '0');
		const slug = url.searchParams.get('slug');

		console.log('🔥 MSW (Server): Posts 요청 모킹됨', { limit, offset, slug });

		// slug로 특정 포스트 조회
		if (slug) {
			const post = mockPosts.find((p) => p.slug === slug);
			if (post) {
				return HttpResponse.json([post]);
			}
			return HttpResponse.json([], { status: 404 });
		}

		// 목록 조회
		const paginatedPosts = mockPosts.slice(offset, offset + limit);

		return HttpResponse.json(paginatedPosts, {
			headers: {
				'Content-Range': `0-${paginatedPosts.length - 1}/${mockPosts.length}`
			}
		});
	})
];
