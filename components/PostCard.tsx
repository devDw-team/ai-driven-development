'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle } from 'lucide-react';
import { IPost, IPostCardProps } from '@/types';
import { Button } from '@/components/ui/button';

export default function PostCard({ post, onLike, onComment }: IPostCardProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike?.(post.postId);
  };

  const handleComment = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onComment?.(post.postId);
  };

  const handleCardClick = () => {
    router.push(`/post/${post.postId}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-[1.02]"
      onClick={handleCardClick}
    >
      <div className="relative aspect-square">
        <Image
          src={post.imageURL}
          alt={post.prompt}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center space-x-2">
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={post.userProfile}
              alt={post.userName}
              fill
              className="object-cover"
            />
          </div>
          <span className="font-medium">{post.userName}</span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{post.prompt}</p>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="space-x-1"
            onClick={handleLike}
          >
            <Heart
              className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
            />
            <span>{likesCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="space-x-1"
            onClick={handleComment}
          >
            <MessageCircle className="w-5 h-5" />
            <span>{post.comments}</span>
          </Button>
        </div>
      </div>
    </div>
  );
} 