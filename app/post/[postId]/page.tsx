'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockPosts, mockComments } from '@/lib/mockData';
import { IPost, IComment } from '@/types';
import CommentsModal from '@/components/CommentsModal';

export default function PostDetail() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<IPost | null>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);

  useEffect(() => {
    // 실제 API 연동 시 여기서 데이터를 가져옵니다
    const foundPost = mockPosts.find(p => p.postId === params.postId);
    const postComments = mockComments.filter(c => c.postId === params.postId);
    
    if (foundPost) {
      setPost(foundPost);
      setComments(postComments);
    } else {
      router.push('/'); // 포스트를 찾지 못한 경우 메인 페이지로 이동
    }
  }, [params.postId, router]);

  if (!post) return null;

  const handleLike = () => {
    setPost(prev => prev ? {
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
    } : null);
  };

  const handleComment = () => {
    setIsCommentsModalOpen(true);
  };

  const handleAddComment = (content: string) => {
    const newComment: IComment = {
      id: Date.now().toString(),
      postId: post.postId,
      userName: '현재 사용자',
      content,
      createdAt: new Date().toISOString(),
      userProfile: 'https://i.pravatar.cc/150?img=14',
    };

    setComments(prev => [...prev, newComment]);
    setPost(prev => prev ? {
      ...prev,
      comments: prev.comments + 1,
    } : null);
    setNewComment('');
  };

  // 댓글을 최신순으로 정렬
  const sortedComments = [...comments].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          돌아가기
        </Button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* 이미지 섹션 */}
            <div className="relative aspect-square">
              <Image
                src={post.imageURL}
                alt={post.prompt}
                fill
                className="object-cover"
              />
            </div>

            {/* 상세 정보 섹션 */}
            <div className="p-6 space-y-6">
              {/* 작성자 정보 */}
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={post.userProfile}
                    alt={post.userName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="font-semibold">{post.userName}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* 프롬프트 */}
              <div>
                <h3 className="text-lg font-medium mb-2">프롬프트</h3>
                <p className="text-gray-600">{post.prompt}</p>
              </div>

              {/* 상호작용 버튼 */}
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="lg"
                  className="space-x-2"
                  onClick={handleLike}
                >
                  <Heart
                    className={`w-6 h-6 ${
                      post.isLiked ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                  <span>{post.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="space-x-2"
                  onClick={handleComment}
                >
                  <MessageCircle className="w-6 h-6" />
                  <span>{post.comments}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="space-x-2"
                >
                  <Share2 className="w-6 h-6" />
                </Button>
              </div>

              {/* 댓글 입력 */}
              <div className="border-t pt-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newComment.trim()) return;
                    handleAddComment(newComment);
                  }}
                  className="flex space-x-2"
                >
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!newComment.trim()}>
                    작성
                  </Button>
                </form>
              </div>

              {/* 댓글 목록 */}
              <div className="border-t pt-4 space-y-4">
                <h3 className="font-medium">댓글 {post.comments}개</h3>
                {sortedComments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={comment.userProfile}
                        alt={comment.userName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{comment.userName}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CommentsModal
        isOpen={isCommentsModalOpen}
        onClose={() => setIsCommentsModalOpen(false)}
        postId={post.postId}
        comments={comments}
        onAddComment={handleAddComment}
      />
    </main>
  );
} 