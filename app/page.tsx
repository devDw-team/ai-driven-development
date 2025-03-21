'use client';

import { useState } from 'react';
import PromptInput from '@/components/PromptInput';
import PostCard from '@/components/PostCard';
import CommentsModal from '@/components/CommentsModal';
import { mockPosts, mockComments } from '@/lib/mockData';
import { IPost, IComment } from '@/types';

export default function Home() {
  const [posts, setPosts] = useState<IPost[]>(mockPosts);
  const [comments, setComments] = useState<IComment[]>(mockComments);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const handleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.postId === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleComment = (postId: string) => {
    setSelectedPostId(postId);
  };

  const handleAddComment = (content: string) => {
    if (!selectedPostId) return;

    const newComment: IComment = {
      id: Date.now().toString(),
      postId: selectedPostId,
      userName: '현재 사용자',
      content,
      createdAt: new Date().toISOString(),
      userProfile: 'https://i.pravatar.cc/150?img=14',
    };

    setComments(prev => [...prev, newComment]);
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.postId === selectedPostId
          ? { ...post, comments: post.comments + 1 }
          : post
      )
    );
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
