'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IComment, ICommentsModalProps } from '@/types';
import { toast } from 'sonner';

export default function CommentsModal({
  isOpen,
  onClose,
  postId,
  comments: initialComments,
  onAddComment,
}: ICommentsModalProps) {
  const [comments, setComments] = useState<IComment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 댓글 목록 조회
  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/post/${postId}/comments`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || '댓글을 불러오는데 실패했습니다.');
      }

      setComments(data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('댓글을 불러오는데 실패했습니다.');
    }
  };

  // 모달이 열릴 때마다 댓글 목록 새로고침
  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/post/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment.trim() }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || '댓글 작성에 실패했습니다.');
      }

      // 새 댓글을 목록에 추가
      setComments((prev) => [data.comment, ...prev]);
      setNewComment('');
      onAddComment?.(data.comment);

      toast.success('댓글이 작성되었습니다.');
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.error('댓글 작성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">댓글</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.map((comment) => (
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
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={!newComment.trim() || isLoading}>
              {isLoading ? '작성 중...' : '작성'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 