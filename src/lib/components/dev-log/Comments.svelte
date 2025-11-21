<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase, commentService } from '../../supabase.js';
	import { hashPassword } from '../../utils/crypto.js';
	import { formatDistanceToNow } from '../../utils/date.js';
	import type { Comment, CommentInput } from '../../types.js';

	export let postId: string;

	let comments: Comment[] = [];
	let loading = false;
	let isSubmitting = false;
	let isSigningIn = false;
	let githubUser: any = null;
	let authMode: 'anonymous' | 'github' = 'anonymous';
	let showCommentForm = false;
	let editingComment: Comment | null = null;
	let showDeleteModal = false;
	let deletingComment: Comment | null = null;

	// 에러 상태 관리
	let errorState = {
		hasError: false,
		message: '',
		type: 'error' as 'error' | 'warning' | 'info' | 'success'
	};

	// 댓글 작성 폼 데이터
	let commentForm: CommentInput = {
		content: '',
		author_name: '',
		password: ''
	};

	// 댓글 수정/삭제 시 비밀번호 확인용
	let actionPassword = '';
	let passwordError = '';

	// 메시지 상태 관리 함수들
	function showMessage(message: string, type: 'error' | 'warning' | 'info' | 'success' = 'error') {
		errorState = {
			hasError: true,
			message,
			type
		};

		// 성공 메시지는 3초, 나머지는 5초 후 자동으로 숨기기
		const timeout = type === 'success' ? 3000 : 5000;
		setTimeout(() => {
			clearMessage();
		}, timeout);
	}

	function clearMessage() {
		errorState = {
			hasError: false,
			message: '',
			type: 'error'
		};
	}

	function handleError(err: unknown, defaultMessage: string = '알 수 없는 오류가 발생했습니다.') {
		const errorMessage = err instanceof Error ? err.message : String(err);
		console.error('에러 발생:', errorMessage);
		showMessage(errorMessage || defaultMessage, 'error');
		return errorMessage;
	}

	// 하위 호환성을 위한 별칭
	const showError = (message: string, type: 'error' | 'warning' | 'info' = 'error') =>
		showMessage(message, type);
	const clearError = clearMessage;

	onMount(async () => {
		await checkGithubAuth();
		await loadComments();

		// Auth state change 감지하여 자동으로 상태 업데이트
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
				if (session?.user) {
					githubUser = session.user.user_metadata;
					isSigningIn = false;
				}
			} else if (event === 'SIGNED_OUT') {
				githubUser = null;
				authMode = 'anonymous';
				isSigningIn = false;
			}
		});

		// 컴포넌트 언마운트 시 구독 해제
		return () => {
			subscription.unsubscribe();
		};
	});

	// GitHub 인증 상태 확인
	async function checkGithubAuth() {
		const {
			data: { session }
		} = await supabase.auth.getSession();
		if (session?.user) {
			githubUser = session.user.user_metadata;
			if (import.meta.env.DEV) {
				console.log('GitHub 사용자 정보:', githubUser);
				console.log('전체 사용자 정보:', session.user);
			}
		}
	}

	// 댓글 목록 로드
	async function loadComments() {
		loading = true;
		clearMessage(); // 이전 메시지 상태 초기화

		try {
			if (import.meta.env.DEV) {
				console.log('댓글 로드 시작, postId:', postId);
			}
			comments = await commentService.getComments(postId);
			if (import.meta.env.DEV) {
				console.log('댓글 로드 성공:', comments);
			}
		} catch (err: unknown) {
			const errorMessage = handleError(err, '댓글을 불러오는 중 오류가 발생했습니다.');

			// 테이블이 없는 경우 경고 메시지 표시
			if (errorMessage.includes('relation "comments" does not exist')) {
				showError('댓글 테이블이 존재하지 않습니다. 관리자에게 문의해주세요.', 'warning');
			}

			// 에러가 발생해도 빈 배열로 초기화하여 앱이 계속 작동하도록 함
			comments = [];
		} finally {
			loading = false;
		}
	}

	// GitHub 로그인
	async function signInWithGithub() {
		if (isSigningIn) return; // 이미 로그인 진행 중이면 중복 실행 방지

		isSigningIn = true;
		try {
			// 환경변수에서 사이트 URL 가져오기, 없으면 현재 URL 사용
			let siteUrl = import.meta.env.VITE_SITE_URL;

			// 개발 환경에서는 현재 URL을 사용
			if (import.meta.env.DEV || !siteUrl) {
				siteUrl = window.location.origin;
			}

			const redirectUrl = `${siteUrl}${window.location.pathname}`;

			const { error } = await supabase.auth.signInWithOAuth({
				provider: 'github',
				options: {
					redirectTo: redirectUrl
				}
			});
			if (error) throw error;

			// OAuth 리디렉션이 성공적으로 시작되면 로딩 상태는 유지
			// (페이지가 리디렉션되므로 isSigningIn = false는 필요 없음)
		} catch (err: unknown) {
			isSigningIn = false;
			handleError(err, 'GitHub 로그인 중 오류가 발생했습니다.');
		}
	}

	// 로그아웃
	async function signOut() {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			githubUser = null;
			authMode = 'anonymous';
		} catch (err: unknown) {
			handleError(err, '로그아웃 중 오류가 발생했습니다.');
		}
	}

	// 댓글 작성
	async function submitComment() {
		if (import.meta.env.DEV) {
			console.log('댓글 작성 시작:', { authMode, postId, githubUser });
		}

		if (!commentForm.content.trim()) {
			showError('댓글 내용을 입력해주세요.');
			return;
		}

		if (authMode === 'anonymous') {
			if (!commentForm.author_name.trim()) {
				showError('작성자명을 입력해주세요.');
				return;
			}
			if (!commentForm.password || commentForm.password.length < 4) {
				showError('비밀번호를 4자 이상 입력해주세요.');
				return;
			}
		} else if (authMode === 'github') {
			if (!githubUser) {
				showError('GitHub 로그인이 필요합니다.');
				return;
			}
		}

		isSubmitting = true;
		try {
			if (authMode === 'anonymous') {
				if (import.meta.env.DEV) {
					console.log('익명 댓글 작성 중...');
				}
				const passwordHash = await hashPassword(commentForm.password!);
				await commentService.createAnonymousComment(
					postId,
					commentForm.content,
					commentForm.author_name,
					passwordHash
				);
			} else if (githubUser) {
				if (import.meta.env.DEV) {
					console.log('GitHub 댓글 작성 중...', githubUser);
				}
				await commentService.createGithubComment(postId, commentForm.content, githubUser);
			}

			if (import.meta.env.DEV) {
				console.log('댓글 작성 성공');
			}
			// 폼 초기화
			commentForm = {
				content: '',
				author_name: '',
				password: ''
			};
			showCommentForm = false;

			// 성공 메시지 표시
			showMessage('댓글이 성공적으로 등록되었습니다!', 'success');

			// 댓글 목록 새로고침
			await loadComments();
		} catch (err: unknown) {
			const errorMessage = handleError(err, '댓글 작성에 실패했습니다.');
			// alert 대신 에러 상태로 표시
		} finally {
			isSubmitting = false;
		}
	}

	// 댓글 수정
	async function editComment(comment: Comment) {
		if (comment.author_type === 'anonymous') {
			const password = prompt('비밀번호를 입력하세요:');
			if (!password) return;

			try {
				const passwordHash = await hashPassword(password);
				const isValid = await commentService.verifyAnonymousComment(comment.id, passwordHash);
				if (!isValid) {
					showError('비밀번호가 일치하지 않습니다.');
					return;
				}
			} catch (err: unknown) {
				handleError(err, '비밀번호 확인에 실패했습니다.');
				return;
			}
		} else if (comment.author_type === 'github') {
			const githubUserId = githubUser?.id || githubUser?.sub || githubUser?.user_id;
			if (!githubUser || !githubUserId || comment.github_user_id !== githubUserId.toString()) {
				showError('본인이 작성한 댓글만 수정할 수 있습니다.');
				return;
			}
		}

		editingComment = comment;
		commentForm.content = comment.content;
	}

	// 댓글 수정 저장
	async function saveEditComment() {
		if (!editingComment || !commentForm.content.trim()) return;

		isSubmitting = true;
		try {
			await commentService.updateComment(editingComment.id, commentForm.content);
			editingComment = null;
			commentForm.content = '';
			showMessage('댓글이 성공적으로 수정되었습니다!', 'success');
			await loadComments();
		} catch (err: unknown) {
			handleError(err, '댓글 수정에 실패했습니다.');
		} finally {
			isSubmitting = false;
		}
	}

	// 댓글 삭제 확인
	async function confirmDeleteComment(comment: Comment) {
		deletingComment = comment;
		showDeleteModal = true;
	}

	// 댓글 삭제
	async function deleteComment() {
		if (!deletingComment) return;

		if (deletingComment.author_type === 'anonymous') {
			if (!actionPassword) {
				passwordError = '비밀번호를 입력해주세요.';
				return;
			}

			try {
				const passwordHash = await hashPassword(actionPassword);
				const isValid = await commentService.verifyAnonymousComment(
					deletingComment.id,
					passwordHash
				);
				if (!isValid) {
					passwordError = '비밀번호가 일치하지 않습니다.';
					return;
				}
			} catch (err: unknown) {
				handleError(err, '비밀번호 확인에 실패했습니다.');
				passwordError = '비밀번호 확인에 실패했습니다.';
				return;
			}
		} else if (deletingComment.author_type === 'github') {
			const githubUserId = githubUser?.id || githubUser?.sub || githubUser?.user_id;
			if (
				!githubUser ||
				!githubUserId ||
				deletingComment.github_user_id !== githubUserId.toString()
			) {
				showError('본인이 작성한 댓글만 삭제할 수 있습니다.');
				return;
			}
		}

		try {
			await commentService.deleteComment(deletingComment.id);
			showMessage('댓글이 성공적으로 삭제되었습니다!', 'success');
			await loadComments();
			closeDeleteModal();
		} catch (err: unknown) {
			handleError(err, '댓글 삭제에 실패했습니다.');
		}
	}

	// 삭제 모달 닫기
	function closeDeleteModal() {
		showDeleteModal = false;
		deletingComment = null;
		actionPassword = '';
		passwordError = '';
	}

	// 수정 취소
	function cancelEdit() {
		editingComment = null;
		commentForm.content = '';
	}

	// 인증 모드 변경
	function switchAuthMode(mode: 'anonymous' | 'github') {
		authMode = mode;
		if (mode === 'github' && !githubUser && !isSigningIn) {
			signInWithGithub();
		}
	}

	// 개발용 세션 정리 함수
	async function clearSupabaseSession() {
		try {
			if (import.meta.env.DEV) {
				console.log('Supabase 세션 정리 시작...');
			}

			// Supabase 로그아웃
			await supabase.auth.signOut();

			// 로컬 스토리지에서 Supabase 관련 데이터 삭제
			const supabaseKeys = Object.keys(localStorage).filter((key) => key.startsWith('sb-'));
			supabaseKeys.forEach((key) => {
				if (import.meta.env.DEV) {
					console.log('삭제:', key);
				}
				localStorage.removeItem(key);
			});

			// 세션 스토리지도 정리
			const sessionKeys = Object.keys(sessionStorage).filter((key) => key.startsWith('sb-'));
			sessionKeys.forEach((key) => {
				if (import.meta.env.DEV) {
					console.log('세션 스토리지 삭제:', key);
				}
				sessionStorage.removeItem(key);
			});

			// 상태 초기화
			githubUser = null;
			authMode = 'anonymous';

			showMessage('세션이 정리되었습니다. 페이지를 새로고침해주세요.', 'success');

			if (import.meta.env.DEV) {
				console.log('세션 정리 완료');
			}
		} catch (err: unknown) {
			handleError(err, '세션 정리 중 오류가 발생했습니다.');
		}
	}
</script>

<div class="max-w-none">
	<div class="flex items-center justify-between mb-6">
		<h2 class="text-2xl font-bold text-primary">
			댓글 {#if comments.length > 0}({comments.length}){/if}
		</h2>

		<div class="flex gap-2">
			{#if !showCommentForm}
				<button type="button" onclick={() => (showCommentForm = true)}> 댓글 작성 </button>
			{/if}
		</div>
	</div>

	<!-- 메시지 표시 -->
	{#if errorState.hasError}
		<div
			class="mb-4 p-4 rounded-lg border flex items-center justify-between transition-all duration-300 transform animate-slideIn {errorState.type ===
			'error'
				? 'bg-red-50 border-red-200 text-red-800'
				: errorState.type === 'warning'
					? 'bg-yellow-50 border-yellow-200 text-yellow-800'
					: errorState.type === 'success'
						? 'bg-green-50 border-green-200 text-green-800'
						: 'bg-blue-50 border-blue-200 text-blue-800'}"
		>
			<div class="flex items-center gap-2">
				{#if errorState.type === 'error'}
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clip-rule="evenodd"
						></path>
					</svg>
				{:else if errorState.type === 'warning'}
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
							clip-rule="evenodd"
						></path>
					</svg>
				{:else if errorState.type === 'success'}
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"
						></path>
					</svg>
				{:else}
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
							clip-rule="evenodd"
						></path>
					</svg>
				{/if}
				<span>{errorState.message}</span>
			</div>
			<button
				onclick={clearMessage}
				class="text-current hover:opacity-75 transition-opacity"
				aria-label="메시지 닫기"
			>
				<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"
					></path>
				</svg>
			</button>
		</div>
	{/if}

	<!-- 댓글 작성 폼 -->
	{#if showCommentForm}
		<div
			class="bg-surface p-6 rounded-lg border border-primary/20 mb-6 transition-all duration-300"
		>
			<div class="flex items-center gap-4 mb-4">
				<h3 class="text-lg font-semibold text-primary">댓글 작성</h3>
				<div class="flex gap-2">
					<button
						class="px-3 py-1 text-sm rounded-md transition-colors {authMode === 'anonymous'
							? 'bg-brand-primary text-white'
							: 'bg-surface-secondary text-secondary'}"
						onclick={() => switchAuthMode('anonymous')}
					>
						익명
					</button>
					<button
						class="px-3 py-1 text-sm rounded-md transition-colors {authMode === 'github'
							? 'bg-brand-primary text-white'
							: 'bg-surface-secondary text-secondary'}"
						onclick={() => switchAuthMode('github')}
					>
						GitHub
					</button>
				</div>
			</div>

			{#if authMode === 'github'}
				{#if githubUser}
					<div class="flex items-center gap-2 mb-4 p-3 bg-surface-secondary rounded-lg">
						<img src={githubUser.avatar_url} alt={githubUser.name} class="w-8 h-8 rounded-full" />
						<span class="text-primary font-medium">{githubUser.name || githubUser.login}</span>
						<button
							class="text-sm text-secondary hover:text-primary transition-colors ml-auto"
							onclick={signOut}
						>
							로그아웃
						</button>
					</div>
				{:else}
					<div class="text-center py-4">
						<button type="button" onclick={signInWithGithub} disabled={isSigningIn}>
							{#if isSigningIn}
								GitHub 로그인 중...
							{:else}
								GitHub로 로그인
							{/if}
						</button>
					</div>
				{/if}
			{/if}

			{#if authMode === 'anonymous'}
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
					<input type="text" bind:value={commentForm.author_name} placeholder="작성자명" required />
					<input
						bind:value={commentForm.password}
						type="password"
						placeholder="비밀번호 (4자 이상)"
						required
						minlength={4}
					/>
				</div>
			{/if}

			<div class="mb-4">
				<textarea
					bind:value={commentForm.content}
					placeholder="댓글을 입력하세요..."
					class="w-full p-3 border border-primary/20 rounded-md bg-surface text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
					rows="4"
					required
				></textarea>
			</div>

			<div class="flex gap-2 justify-end">
				<button type="button" onclick={() => (showCommentForm = false)}> 취소 </button>
				<button
					type="button"
					onclick={submitComment}
					disabled={isSubmitting || (authMode === 'github' && !githubUser)}
				>
					{#if isSubmitting}
						댓글 등록 중...
					{:else}
						댓글 등록
					{/if}
				</button>
			</div>
		</div>
	{/if}

	<!-- 댓글 목록 -->
	{#if loading}
		<div class="text-center py-8">
			<div
				class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"
			></div>
			<p class="mt-2 text-secondary">댓글을 불러오는 중...</p>
		</div>
	{:else if comments.length === 0}
		<div class="text-center py-8">
			<p class="text-secondary">아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!</p>
		</div>
	{:else}
		<div class="space-y-4">
			{#each comments as comment (comment.id)}
				<div
					class="bg-surface p-4 rounded-lg border border-primary/10 transition-all duration-200 hover:bg-surface-secondary/50 hover:shadow-sm"
				>
					<div class="flex items-start gap-3">
						{#if comment.author_type === 'github' && comment.github_avatar_url}
							<a
								href="https://github.com/{comment.github_username || comment.author_name}"
								target="_blank"
								rel="noopener noreferrer"
								class="flex-shrink-0 transition-opacity hover:opacity-80"
								title="GitHub 프로필 보기"
							>
								<img
									src={comment.github_avatar_url}
									alt={comment.author_name}
									class="w-10 h-10 rounded-full"
								/>
							</a>
						{:else}
							<div
								class="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center flex-shrink-0"
							>
								<span class="text-brand-primary font-medium text-lg">
									{comment.author_name.charAt(0).toUpperCase()}
								</span>
							</div>
						{/if}

						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2 mb-1">
								{#if comment.author_type === 'github'}
									<a
										href="https://github.com/{comment.github_username || comment.author_name}"
										target="_blank"
										rel="noopener noreferrer"
										class="font-medium text-primary hover:text-brand-primary transition-colors"
										title="GitHub 프로필 보기"
									>
										<h4 class="font-medium">{comment.author_name}</h4>
									</a>
								{:else}
									<h4 class="font-medium text-primary">{comment.author_name}</h4>
								{/if}
								{#if comment.author_type === 'github'}
									<a
										href="https://github.com/{comment.github_username || comment.author_name}"
										target="_blank"
										rel="noopener noreferrer"
										class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full hover:bg-blue-200 transition-colors"
										title="GitHub 프로필 보기"
									>
										<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
												clip-rule="evenodd"
											></path>
										</svg>
										GitHub
										<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
											<path
												d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"
											></path>
											<path
												d="M5 5a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2v-2a1 1 0 10-2 0v2H5V7h2a1 1 0 000-2H5z"
											></path>
										</svg>
									</a>
								{/if}
								{#if comment.is_edited}
									<span class="text-xs text-secondary">(수정됨)</span>
								{/if}
							</div>

							{#if editingComment?.id === comment.id}
								<div class="space-y-3">
									<textarea
										bind:value={commentForm.content}
										class="w-full p-3 border border-primary/20 rounded-md bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
										rows="3"
									></textarea>
									<div class="flex gap-2">
										<button type="button" onclick={saveEditComment} disabled={isSubmitting}>
											{#if isSubmitting}
												저장 중...
											{:else}
												저장
											{/if}
										</button>
										<button type="button" onclick={cancelEdit}>취소</button>
									</div>
								</div>
							{:else}
								<p class="text-primary mb-2 whitespace-pre-wrap">{comment.content}</p>
								<div class="flex items-center justify-between">
									<span class="text-sm text-secondary">
										{formatDistanceToNow(new Date(comment.created_at))} 전
									</span>

									<div class="flex gap-2">
										{#if comment.author_type === 'github' && githubUser && (githubUser.id || githubUser.sub || githubUser.user_id)?.toString() === comment.github_user_id}
											<button
												class="text-sm text-secondary hover:text-primary transition-colors"
												onclick={() => editComment(comment)}
											>
												수정
											</button>
											<button
												class="text-sm text-secondary hover:text-red-500 transition-colors"
												onclick={() => confirmDeleteComment(comment)}
											>
												삭제
											</button>
										{:else if comment.author_type === 'anonymous'}
											<button
												class="text-sm text-secondary hover:text-primary transition-colors"
												onclick={() => editComment(comment)}
											>
												수정
											</button>
											<button
												class="text-sm text-secondary hover:text-red-500 transition-colors"
												onclick={() => confirmDeleteComment(comment)}
											>
												삭제
											</button>
										{/if}
									</div>
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- 삭제 확인 모달 -->
{#if showDeleteModal}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
		<div class="bg-surface p-6 rounded-lg max-w-md w-full mx-4">
			<h3 class="text-lg font-semibold text-primary mb-4">댓글 삭제</h3>
			<p class="text-secondary mb-4">정말로 이 댓글을 삭제하시겠습니까?</p>

			{#if deletingComment?.author_type === 'anonymous'}
				<div class="mb-4">
					<input
						bind:value={actionPassword}
						type="password"
						placeholder="비밀번호를 입력하세요"
						required
					/>
				</div>
			{/if}

			<div class="flex gap-2 justify-end">
				<button type="button" onclick={closeDeleteModal}>취소</button>
				<button type="button" onclick={deleteComment}>삭제</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.animate-slideIn {
		animation: slideIn 0.3s ease-out;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
