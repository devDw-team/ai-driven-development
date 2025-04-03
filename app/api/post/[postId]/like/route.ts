import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { likes, posts } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// 좋아요 토글 (POST)
export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '인증되지 않은 사용자입니다.',
          },
        },
        { status: 401 }
      );
    }

    const postId = parseInt(params.postId);
    if (isNaN(postId)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_POST_ID',
            message: '유효하지 않은 게시물 ID입니다.',
          },
        },
        { status: 400 }
      );
    }

    // 게시물 존재 여부 확인
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
    });

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'POST_NOT_FOUND',
            message: '게시물을 찾을 수 없습니다.',
          },
        },
        { status: 404 }
      );
    }

    // 현재 사용자의 좋아요 상태 확인
    const existingLike = await db.query.likes.findFirst({
      where: and(
        eq(likes.postId, postId),
        eq(likes.userId, userId)
      ),
    });

    if (existingLike) {
      // 좋아요 취소
      await db.delete(likes).where(
        and(
          eq(likes.postId, postId),
          eq(likes.userId, userId)
        )
      );
    } else {
      // 좋아요 추가
      await db.insert(likes).values({
        postId,
        userId,
      });
    }

    // 업데이트된 좋아요 수와 상태 조회
    const updatedLikes = await db.query.likes.findMany({
      where: eq(likes.postId, postId),
    });

    const isLiked = updatedLikes.some(like => like.userId === userId);
    const totalLikes = updatedLikes.length;

    return NextResponse.json({
      success: true,
      data: {
        isLiked,
        likes: totalLikes,
      },
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: '서버 오류가 발생했습니다.',
        },
      },
      { status: 500 }
    );
  }
}

// 좋아요 상태 조회 (GET)
export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '인증되지 않은 사용자입니다.',
          },
        },
        { status: 401 }
      );
    }

    const postId = parseInt(params.postId);
    if (isNaN(postId)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_POST_ID',
            message: '유효하지 않은 게시물 ID입니다.',
          },
        },
        { status: 400 }
      );
    }

    // 게시물 존재 여부 확인
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
    });

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'POST_NOT_FOUND',
            message: '게시물을 찾을 수 없습니다.',
          },
        },
        { status: 404 }
      );
    }

    // 좋아요 상태와 수 조회
    const postLikes = await db.query.likes.findMany({
      where: eq(likes.postId, postId),
    });

    const isLiked = postLikes.some(like => like.userId === userId);
    const totalLikes = postLikes.length;

    return NextResponse.json({
      success: true,
      data: {
        isLiked,
        likes: totalLikes,
      },
    });
  } catch (error) {
    console.error('Error getting like status:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: '서버 오류가 발생했습니다.',
        },
      },
      { status: 500 }
    );
  }
} 