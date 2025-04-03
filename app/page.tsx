'use client';

import { useState, useEffect } from 'react';
import PromptInput from '@/components/PromptInput';
import PostCard from '@/components/PostCard';
import CommentsModal from '@/components/CommentsModal';
import { IPost, IComment } from '@/types';

export default function Home() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [comments, setComments] = useState<IComment[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 커뮤니티 피드 데이터 로드
  const loadPosts = async (pageNum: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/community/feed?page=${pageNum}&limit=12&sortBy=latest`);
      if (!response.ok) {
        throw new Error('피드를 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      
      if (pageNum === 1) {
        setPosts(data.posts);
      } else {
        setPosts(prev => [...prev, ...data.posts]);
      }
      setHasMore(data.hasMore);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    loadPosts();
  }, []);

  // 무한 스크롤 처리
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100 &&
        !isLoading &&
        hasMore
      ) {
        loadPosts(page + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore, page]);

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/post/${postId}/like`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('좋아요 처리에 실패했습니다.');
      }

      const data = await response.json();
      
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.postId === postId
            ? {
                ...post,
                isLiked: data.isLiked,
                likes: data.likes,
              }
            : post
        )
      );
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleComment = (postId: string) => {
    setSelectedPostId(postId);
  };

  const handleAddComment = async (content: string) => {
    if (!selectedPostId) return;

    try {
      const response = await fetch(`/api/post/${selectedPostId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('댓글 작성에 실패했습니다.');
      }

      const data = await response.json();
      
      if (data.comment) {
        setComments(prev => [...prev, data.comment]);
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post.postId === selectedPostId
              ? { ...post, comments: post.comments + 1 }
              : post
          )
        );
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const selectedPostComments = comments.filter(
    comment => comment.postId === selectedPostId
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          AI 이미지 생성
        </h1>
        <PromptInput />
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">커뮤니티 갤러리</h2>
          {error && (
            <div className="text-red-500 text-center mb-4">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.postId}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
              />
            ))}
          </div>
          {isLoading && (
            <div className="text-center mt-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
        </div>
      </div>

      <CommentsModal
        isOpen={!!selectedPostId}
        onClose={() => setSelectedPostId(null)}
        postId={selectedPostId || ''}
        comments={selectedPostComments}
        onAddComment={handleAddComment}
      />
    </main>
  );
}
