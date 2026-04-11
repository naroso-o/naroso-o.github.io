export interface PostMetadata {
	title: string;
	excerpt?: string;
	published_at?: string;
	created: string;
	updated?: string;
	tags?: string[];
}

export function generateSEOData(post: PostMetadata) {
	return {
		title: `${post.title} - naroso-o.blog`,
		description: post.excerpt || post.title,
		openGraph: {
			title: post.title,
			description: post.excerpt || post.title,
			type: 'article',
			publishedTime: post.published_at || post.created,
			modifiedTime: post.updated,
			tags: post.tags || []
		}
	};
}

export function generatePostStatus(post: PostMetadata) {
	return {
		isUpdated: post.updated !== post.created,
		publishedDate: post.published_at || post.created,
		updatedDate: post.updated
	};
} 