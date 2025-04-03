import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/db';
import { posts, images, likes, comments } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const postId = parseInt(params.postId);
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    // 게시물 상세 정보 조회
    const postData = await db
      .select({
        postId: posts.id,
        imageURL: sql<string>`CONCAT('https://nllylmjqgcmjjmueltux.supabase.co/storage/v1/object/public/images/', ${images.filePath})`,
        userName: posts.userId,
        likes: sql<number>`(SELECT COUNT(*) FROM ${likes} WHERE ${likes.postId} = ${posts.id})`,
        comments: sql<number>`(SELECT COUNT(*) FROM ${comments} WHERE ${comments.postId} = ${posts.id})`,
        isLiked: sql<boolean>`EXISTS (SELECT 1 FROM ${likes} WHERE ${likes.postId} = ${posts.id} AND ${likes.userId} = ${userId})`,
        prompt: images.prompt,
        createdAt: posts.createdAt,
        userProfile: sql<string>`CONCAT('https://i.pravatar.cc/150?img=', ${posts.userId})`,
        title: posts.title,
        description: posts.description,
        artStyle: images.artStyle,
        colorTone: images.colorTone,
        tags: images.tags,
      })
      .from(posts)
      .innerJoin(images, eq(posts.imageId, images.id))
      .where(eq(posts.id, postId))
      .limit(1)
      .then((result) => result[0]);

    if (!postData) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      post: postData,
    });
  } catch (error) {
    console.error('Error fetching post details:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 