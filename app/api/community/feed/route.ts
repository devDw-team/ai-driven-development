import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/db';
import { posts, images, likes, comments } from '@/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { getAuth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // URL 파라미터 파싱
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sortBy = searchParams.get('sortBy') || 'latest';

    // 페이지네이션 계산
    const offset = (page - 1) * limit;

    // 정렬 조건 설정
    const orderBy = sortBy === 'oldest' ? posts.createdAt : desc(posts.createdAt);

    // 공개된 게시물 조회 (이미지와 함께)
    const [postsData, totalCount] = await Promise.all([
      db
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
        })
        .from(posts)
        .innerJoin(images, eq(posts.imageId, images.id))
        .where(eq(images.isPublic, true))
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(posts)
        .innerJoin(images, eq(posts.imageId, images.id))
        .where(eq(images.isPublic, true))
        .then((result) => Number(result[0].count)),
    ]);

    // 다음 페이지 존재 여부 확인
    const hasMore = offset + postsData.length < totalCount;

    return NextResponse.json({
      posts: postsData,
      totalCount,
      hasMore,
    });
  } catch (error) {
    console.error('Error fetching community feed:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 