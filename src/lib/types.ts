export interface Post {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	content?: string;
	view_count: number;
	tags?: string[];
	featured?: boolean;
	thumbnail?: string;
	created: string;
	updated?: string;
	published_at?: string;
}
