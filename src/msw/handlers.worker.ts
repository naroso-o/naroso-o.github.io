//
// app/src/msw/handlers.worker.ts
//
import { http, HttpResponse } from 'msw';
import { mockPosts } from './fixtures/supabase-mock';

// Supabase URL (환경변수에서 가져오기)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// Mock relative URLs that map to your
// routes' data endpoints. This mock only
// happens for client-side requests.
//
// Note that if you use shadow endpoints, this still works
// as the endpoint gets created by SvelteKit.
export const handlers = [
	http.get(`${SUPABASE_URL}/rest/v1/pieces`, ({ request }) => {
		const url = new URL(request.url);
		const limit = parseInt(url.searchParams.get('limit') || '10');
		const offset = parseInt(url.searchParams.get('offset') || '0');
		const select = url.searchParams.get('select') || '*';

		console.log('🔥 MSW: Posts 요청 모킹됨', { limit, offset, select });

		const paginatedPosts = mockPosts.slice(offset, offset + limit);

		return HttpResponse.json(paginatedPosts, {
			headers: {
				'Content-Range': `0-${paginatedPosts.length - 1}/${mockPosts.length}`
			}
		});
	})
];
