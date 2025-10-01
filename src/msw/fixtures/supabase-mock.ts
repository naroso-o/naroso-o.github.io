export const mockPosts = [
	{
		id: '1',
		title: '첫 번째 모킹 포스트',
		content: '이것은 MSW로 모킹된 포스트입니다.',
		slug: 'first-mock-post',
		excerpt: '첫 번째 모킹 포스트의 요약',
		tags: ['msw', 'supabase', 'mock'],
		status: 'published',
		published_at: new Date().toISOString(),
		created_at: new Date().toISOString(),
		view_count: 42,
		featured: true,
        thumbnail: 'https://res.cloudinary.com/dkhtbn9hn/image/upload/v1752407238/20250712091949149_bnnxaf.jpg' // 정사각형 이미지
	},
	{
		id: '2',
		title: '두 번째 모킹 포스트',
		content: '또 다른 모킹된 포스트입니다.',
		slug: 'second-mock-post',
		excerpt: '두 번째 모킹 포스트의 요약',
		tags: ['testing', 'development'],
		status: 'published',
		published_at: new Date(Date.now() - 86400000).toISOString(), // 1일 전
		created_at: new Date(Date.now() - 86400000).toISOString(),
		view_count: 24,
		featured: false,
        thumbnail: 'https://res.cloudinary.com/dkhtbn9hn/image/upload/v1752579825/20250715203533393_cb213s.jpg' // 가로 이미지
	},
    {
        id: '3',
        title: '세 번째 모킹 포스트',
        content: '세 번째 모킹된 포스트입니다.',
        slug: 'third-mock-post',
        excerpt: '세 번째 모킹 포스트의 요약',
        tags: ['testing', 'development'],
        status: 'published',
        published_at: new Date(Date.now() - 86400000).toISOString(), // 1일 전
        created_at: new Date(Date.now() - 86400000).toISOString(),
        view_count: 24,
        featured: false,
        thumbnail: 'https://res.cloudinary.com/dkhtbn9hn/image/upload/v1752407238/20250712091949149_bnnxaf.jpg' // 정사각형 이미지
    },
    {
        id: '4',
        title: '네 번째 모킹 포스트',
        content: '네 번째 모킹된 포스트입니다.',
        slug: 'fourth-mock-post',
        excerpt: '네 번째 모킹 포스트의 요약',
        tags: ['testing', 'development'],
        status: 'published',
        published_at: new Date(Date.now() - 86400000).toISOString(), // 1일 전
        created_at: new Date(Date.now() - 86400000).toISOString(),
        view_count: 24,
        featured: false,
        thumbnail: 'https://res.cloudinary.com/dkhtbn9hn/image/upload/v1752579825/20250715203533393_cb213s.jpg' // 가로 이미지
    },
    {
        id: '5',
        title: '다섯 번째 모킹 포스트',
        content: '다섯 번째 모킹된 포스트입니다.',
        slug: 'fifth-mock-post',
        excerpt: '다섯 번째 모킹 포스트의 요약',
        tags: ['testing', 'development'],
        status: 'published',
        published_at: new Date(Date.now() - 86400000).toISOString(), // 1일 전
        created_at: new Date(Date.now() - 86400000).toISOString(),
        view_count: 24,
        featured: false,
        thumbnail: 'https://res.cloudinary.com/dkhtbn9hn/image/upload/v1752407238/20250712091949149_bnnxaf.jpg' // 정사각형 이미지
    },
    {
        id: '6',
        title: '여섯 번째 모킹 포스트',
        content: '여섯 번째 모킹된 포스트입니다.',
        slug: 'sixth-mock-post',
        excerpt: '여섯 번째 모킹 포스트의 요약',
        tags: ['ui', 'design'],
        status: 'published',
        published_at: new Date(Date.now() - 172800000).toISOString(), // 2일 전
        created_at: new Date(Date.now() - 172800000).toISOString(),
        view_count: 35,
        featured: false,
        thumbnail: 'https://res.cloudinary.com/dkhtbn9hn/image/upload/v1752579825/20250715203533393_cb213s.jpg' // 가로 이미지
    },
    {
        id: '7',
        title: '일곱 번째 모킹 포스트',
        content: '일곱 번째 모킹된 포스트입니다.',
        slug: 'seventh-mock-post',
        excerpt: '일곱 번째 모킹 포스트의 요약',
        tags: ['frontend', 'svelte'],
        status: 'published',
        published_at: new Date(Date.now() - 259200000).toISOString(), // 3일 전
        created_at: new Date(Date.now() - 259200000).toISOString(),
        view_count: 18,
        featured: true,
        thumbnail: 'https://res.cloudinary.com/dkhtbn9hn/image/upload/v1752407238/20250712091949149_bnnxaf.jpg' // 정사각형 이미지
    },
    {
        id: '8',
        title: '여덟 번째 모킹 포스트',
        content: '여덟 번째 모킹된 포스트입니다.',
        slug: 'eighth-mock-post',
        excerpt: '여덟 번째 모킹 포스트의 요약',
        tags: ['backend', 'nodejs'],
        status: 'published',
        published_at: new Date(Date.now() - 345600000).toISOString(), // 4일 전
        created_at: new Date(Date.now() - 345600000).toISOString(),
        view_count: 67,
        featured: false,
        thumbnail: 'https://res.cloudinary.com/dkhtbn9hn/image/upload/v1752579825/20250715203533393_cb213s.jpg' // 가로 이미지
    },
    {
        id: '9',
        title: '아홉 번째 모킹 포스트',
        content: '아홉 번째 모킹된 포스트입니다.',
        slug: 'ninth-mock-post',
        excerpt: '아홉 번째 모킹 포스트의 요약',
        tags: ['javascript', 'tutorial'],
        status: 'published',
        published_at: new Date(Date.now() - 432000000).toISOString(), // 5일 전
        created_at: new Date(Date.now() - 432000000).toISOString(),
        view_count: 53,
        featured: false,
        thumbnail: 'https://res.cloudinary.com/dkhtbn9hn/image/upload/v1752407238/20250712091949149_bnnxaf.jpg' // 정사각형 이미지
    },
    {
        id: '10',
        title: '열 번째 모킹 포스트',
        content: '열 번째 모킹된 포스트입니다.',
        slug: 'tenth-mock-post',
        excerpt: '열 번째 모킹 포스트의 요약',
        tags: ['css', 'styling'],
        status: 'published',
        published_at: new Date(Date.now() - 518400000).toISOString(), // 6일 전
        created_at: new Date(Date.now() - 518400000).toISOString(),
        view_count: 29,
        featured: true,
        thumbnail: 'https://res.cloudinary.com/dkhtbn9hn/image/upload/v1752579825/20250715203533393_cb213s.jpg' // 가로 이미지
    },
    {
        id: '11',
        title: '열한 번째 모킹 포스트',
        content: '열한 번째 모킹된 포스트입니다.',
        slug: 'eleventh-mock-post',
        excerpt: '열한 번째 모킹 포스트의 요약',
        tags: ['database', 'supabase'],
        status: 'published',
        published_at: new Date(Date.now() - 604800000).toISOString(), // 7일 전
        created_at: new Date(Date.now() - 604800000).toISOString(),
        view_count: 45,
        featured: false,
        thumbnail: 'https://res.cloudinary.com/dkhtbn9hn/image/upload/v1752407238/20250712091949149_bnnxaf.jpg' // 정사각형 이미지
    },
    {
        id: '12',
        title: '열두 번째 모킹 포스트',
        content: '열두 번째 모킹된 포스트입니다.',
        slug: 'twelfth-mock-post',
        excerpt: '열두 번째 모킹 포스트의 요약',
        tags: ['api', 'rest'],
        status: 'published',
        published_at: new Date(Date.now() - 691200000).toISOString(), // 8일 전
        created_at: new Date(Date.now() - 691200000).toISOString(),
        view_count: 62,
        featured: false,
        thumbnail: 'https://res.cloudinary.com/dkhtbn9hn/image/upload/v1752579825/20250715203533393_cb213s.jpg' // 가로 이미지
    },
    {
        id: '13',
        title: '열세 번째 모킹 포스트',
        content: '열세 번째 모킹된 포스트입니다.',
        slug: 'thirteenth-mock-post',
        excerpt: '열세 번째 모킹 포스트의 요약',
        tags: ['typescript', 'types'],
        status: 'published',
        published_at: new Date(Date.now() - 777600000).toISOString(), // 9일 전
        created_at: new Date(Date.now() - 777600000).toISOString(),
        view_count: 38,
        featured: true,
        thumbnail: 'https://res.cloudinary.com/dkhtbn9hn/image/upload/v1752407238/20250712091949149_bnnxaf.jpg' // 정사각형 이미지
    },
    {
        id: '14',
        title: '열네 번째 모킹 포스트',
        content: '열네 번째 모킹된 포스트입니다.',
        slug: 'fourteenth-mock-post',
        excerpt: '열네 번째 모킹 포스트의 요약',
        tags: ['vite', 'build'],
        status: 'published',
        published_at: new Date(Date.now() - 864000000).toISOString(), // 10일 전
        created_at: new Date(Date.now() - 864000000).toISOString(),
        view_count: 27,
        featured: false,
        thumbnail: 'https://res.cloudinary.com/dkhtbn9hn/image/upload/v1752579825/20250715203533393_cb213s.jpg' // 가로 이미지
    },
    {
        id: '15',
        title: '열다섯 번째 모킹 포스트',
        content: '열다섯 번째 모킹된 포스트입니다.',
        slug: 'fifteenth-mock-post',
        excerpt: '열다섯 번째 모킹 포스트의 요약',
        tags: ['performance', 'optimization'],
        status: 'published',
        published_at: new Date(Date.now() - 950400000).toISOString(), // 11일 전
        created_at: new Date(Date.now() - 950400000).toISOString(),
        view_count: 73,
        featured: false,
        thumbnail: 'https://res.cloudinary.com/dkhtbn9hn/image/upload/v1752407238/20250712091949149_bnnxaf.jpg' // 정사각형 이미지
    },
    {
        id: '16',
        title: '열여섯 번째 모킹 포스트',
        content: '열여섯 번째 모킹된 포스트입니다.',
        slug: 'sixteenth-mock-post',
        excerpt: '열여섯 번째 모킹 포스트의 요약',
        tags: ['git', 'version-control'],
        status: 'published',
        published_at: new Date(Date.now() - 1036800000).toISOString(), // 12일 전
        created_at: new Date(Date.now() - 1036800000).toISOString(),
        view_count: 41,
        featured: true,
        thumbnail: 'https://res.cloudinary.com/dkhtbn9hn/image/upload/v1752579825/20250715203533393_cb213s.jpg' // 가로 이미지
    },
    {
        id: '17',
        title: '열일곱 번째 모킹 포스트',
        content: '열일곱 번째 모킹된 포스트입니다.',
        slug: 'seventeenth-mock-post',
        excerpt: '열일곱 번째 모킹 포스트의 요약',
        tags: ['docker', 'container'],
        status: 'published',
        published_at: new Date(Date.now() - 1123200000).toISOString(), // 13일 전
        created_at: new Date(Date.now() - 1123200000).toISOString(),
        view_count: 56,
        featured: false,
        thumbnail: 'https://res.cloudinary.com/dkhtbn9hn/image/upload/v1752407238/20250712091949149_bnnxaf.jpg' // 정사각형 이미지
    },
    {
        id: '18',
        title: '열여덟 번째 모킹 포스트',
        content: '열여덟 번째 모킹된 포스트입니다.',
        slug: 'eighteenth-mock-post',
        excerpt: '열여덟 번째 모킹 포스트의 요약',
        tags: ['seo', 'meta'],
        status: 'published',
        published_at: new Date(Date.now() - 1209600000).toISOString(), // 14일 전
        created_at: new Date(Date.now() - 1209600000).toISOString(),
        view_count: 33,
        featured: false,
        thumbnail: 'https://res.cloudinary.com/dkhtbn9hn/image/upload/v1752579825/20250715203533393_cb213s.jpg' // 가로 이미지
    },
    {
        id: '19',
        title: '열아홉 번째 모킹 포스트',
        content: '열아홉 번째 모킹된 포스트입니다.',
        slug: 'nineteenth-mock-post',
        excerpt: '열아홉 번째 모킹 포스트의 요약',
        tags: ['security', 'auth'],
        status: 'published',
        published_at: new Date(Date.now() - 1296000000).toISOString(), // 15일 전
        created_at: new Date(Date.now() - 1296000000).toISOString(),
        view_count: 89,
        featured: true,
        thumbnail: 'https://res.cloudinary.com/dkhtbn9hn/image/upload/v1752407238/20250712091949149_bnnxaf.jpg' // 정사각형 이미지
    },
    {
        id: '20',
        title: '스무 번째 모킹 포스트',
        content: '스무 번째 모킹된 포스트입니다.',
        slug: 'twentieth-mock-post',
        excerpt: '스무 번째 모킹 포스트의 요약',
        tags: ['responsive', 'mobile'],
        status: 'published',
        published_at: new Date(Date.now() - 1382400000).toISOString(), // 16일 전
        created_at: new Date(Date.now() - 1382400000).toISOString(),
        view_count: 47,
        featured: false,
        thumbnail: 'https://res.cloudinary.com/dkhtbn9hn/image/upload/v1752579825/20250715203533393_cb213s.jpg' // 가로 이미지
    }
];

