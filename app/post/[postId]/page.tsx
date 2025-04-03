'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import CommentsModal from '@/components/CommentsModal';
import { toast } from 'sonner';
import { IComment } from '@/types';

interface IPost {
  postId: string;
  imageURL: string;
  userName: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  prompt: string;
  createdAt: string;
  userProfile: string;
  title: string;
  description: string;
  artStyle: string;
  colorTone: string;
  tags: string[];
}

export default function PostDetail() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<IPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [comments, setComments] = useState<IComment[]>([]);

  // 게시물 상세 정보 로드
  useEffect(() => {
    const loadPost = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/post/${params.postId}`);
        if (!response.ok) {
          throw new Error('게시물을 불러오는데 실패했습니다.');
        }
        const data = await response.json();
        setPost(data.post);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [params.postId]);

  // 댓글 목록 로드
  const loadComments = async () => {
    try {
      const response = await fetch(`/api/post/${params.postId}/comments`);
      if (!response.ok) {
        throw new Error('댓글을 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      setComments(data.comments);
    } catch (err) {
      console.error('Error loading comments:', err);
      toast.error('댓글을 불러오는데 실패했습니다.');
    }
  };

  // 좋아요 토글
  const handleLike = async () => {
    if (!post) return;

    try {
      const response = await fetch(`/api/post/${post.postId}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('좋아요 처리에 실패했습니다.');
      }

      const data = await response.json();
      setPost(prev => prev ? {
        ...prev,
        isLiked: data.isLiked,
        likes: data.likes,
      } : null);
    } catch (err) {
      console.error('Error toggling like:', err);
      toast.error('좋아요 처리에 실패했습니다.');
    }
  };

  // 댓글 작성
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !post) return;

    try {
      const response = await fetch(`/api/post/${post.postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: comment.trim() }),
      });

      if (!response.ok) {
        throw new Error('댓글 작성에 실패했습니다.');
      }

      const data = await response.json();
      if (data.success && data.comment) {
        setComments(prev => [data.comment, ...prev]);
        setPost(prev => prev ? {
          ...prev,
          comments: prev.comments + 1,
        } : null);
        setComment('');
        toast.success('댓글이 작성되었습니다.');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error('댓글 작성에 실패했습니다.');
    }
  };

  // 댓글 모달 열기
  const handleOpenCommentModal = () => {
    setIsCommentModalOpen(true);
    loadComments();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error || '게시물을 찾을 수 없습니다.'}</p>
        <Button onClick={() => router.push('/')}>
          메인으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          메인으로 돌아가기
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 이미지 섹션 */}
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src={post.imageURL}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* 정보 섹션 */}
          <div className="space-y-6">
            {/* 작성자 정보 */}
            <div className="flex items-center space-x-4">
              <Image
                src={post.userProfile}
                alt={post.userName}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h3 className="font-semibold">{post.userName}</h3>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                    locale: ko,
                  })}
                </p>
              </div>
            </div>

            {/* 게시물 정보 */}
            <div>
              <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
              <p className="text-gray-600 mb-4">{post.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  <span className="font-medium">프롬프트:</span> {post.prompt}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">스타일:</span> {post.artStyle}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">컬러 톤:</span> {post.colorTone}
                </p>
              </div>
            </div>

            {/* 상호작용 버튼 */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center space-x-2 ${
                  post.isLiked ? 'text-red-500' : ''
                }`}
                onClick={handleLike}
              >
                <Heart className={`h-5 w-5 ${
                  post.isLiked ? 'fill-current' : ''
                }`} />
                <span>{post.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
                onClick={handleOpenCommentModal}
              >
                <MessageCircle className="h-5 w-5" />
                <span>{post.comments}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* 댓글 작성 폼 */}
            <form onSubmit={handleSubmitComment} className="flex space-x-2">
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="flex-1"
              />
              <Button type="submit" disabled={!comment.trim()}>
                작성
              </Button>
            </form>

            {/* 댓글 목록 */}
            <div className="space-y-4">
              <h3 className="font-semibold">댓글 {post.comments}개</h3>
              {comments.slice(0, 3).map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={comment.userProfile || '/default-avatar.png'}
                      alt={comment.userName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{comment.userName}</span>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                          locale: ko,
                        })}
                      </span>
                    </div>
                    <p className="mt-1">{comment.content}</p>
                  </div>
                </div>
              ))}
              {post.comments > 3 && (
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={handleOpenCommentModal}
                >
                  댓글 더보기
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 댓글 모달 */}
      <CommentsModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        postId={post.postId}
        comments={comments}
        onAddComment={async (content: string) => {
          try {
            const response = await fetch(`/api/post/${post.postId}/comments`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ content: content.trim() }),
            });

            if (!response.ok) {
              throw new Error('댓글 작성에 실패했습니다.');
            }

            const data = await response.json();
            if (data.success && data.comment) {
              setComments(prev => [data.comment, ...prev]);
              setPost(prev => prev ? {
                ...prev,
                comments: prev.comments + 1,
              } : null);
              toast.success('댓글이 작성되었습니다.');
            }
          } catch (err) {
            console.error('Error adding comment:', err);
            toast.error('댓글 작성에 실패했습니다.');
          }
        }}
      />
    </div>
  );
} 