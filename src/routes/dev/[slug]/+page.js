import { postService } from '$lib/pocketbase.js';
import { createNotFoundError, handleDatabaseError } from '$lib/utils/error.js';

export const prerender = false;

export async function load({ params }) {
	try {
		const post = await postService.getPostBySlug(params.slug);
		return { post };
	} catch (err) {
		// PocketBase가 레코드를 못 찾으면 status 404 반환
		if (err && typeof err === 'object' && 'status' in err && err.status === 404) {
			createNotFoundError('포스트');
		}
		handleDatabaseError(err, '포스트 불러오기');
	}
}
