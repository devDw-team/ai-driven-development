import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/db';
import { comments, posts } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

// 댓글 목록 조회 (GET)
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

    // 댓글 목록 조회 (최신순)
    const commentsList = await db.query.comments.findMany({
      where: eq(comments.postId, postId),
      orderBy: [desc(comments.createdAt)],
    });

    // Clerk에서 사용자 정보 가져오기
    const userPromises = commentsList.map(async (comment) => {
      const user = await currentUser();
      return {
        id: comment.id.toString(),
        postId: comment.postId.toString(),
        userName: user?.firstName || 'Anonymous',
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
        userProfile: user?.imageUrl,
      };
    });

    const formattedComments = await Promise.all(userPromises);

    return NextResponse.json({
      success: true,
      comments: formattedComments,
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
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

// 댓글 작성 (POST)
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

    // 요청 데이터 파싱
    const { content } = await request.json();
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_CONTENT',
            message: '댓글 내용을 입력해주세요.',
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

    // 댓글 작성
    const [newComment] = await db
      .insert(comments)
      .values({
        postId,
        userId,
        content: content.trim(),
      })
      .returning();

    // Clerk에서 사용자 정보 가져오기
    const user = await currentUser();

    // 응답 데이터 포맷팅
    const formattedComment = {
      id: newComment.id.toString(),
      postId: newComment.postId.toString(),
      userName: user?.firstName || 'Anonymous',
      content: newComment.content,
      createdAt: newComment.createdAt.toISOString(),
      userProfile: user?.imageUrl,
    };

    return NextResponse.json({
      success: true,
      comment: formattedComment,
    });
  } catch (error) {
    console.error('Error creating comment:', error);
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