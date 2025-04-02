import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { images, posts } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { deleteImage } from '@/utils/supabase'
import { IUpdateRequest, IUpdateResponse, IDeleteResponse } from '@/types'
import { getAuth } from '@clerk/nextjs/server'

// 이미지 수정 API
export async function PUT(
  request: NextRequest,
  { params }: { params: { imageId: string } }
) {
  try {
    const { userId } = getAuth(request)
    if (!userId) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      )
    }

    const imageId = parseInt(params.imageId)
    const body: IUpdateRequest = await request.json()

    // 이미지 소유자 확인
    const [existingImage] = await db
      .select()
      .from(images)
      .where(
        and(
          eq(images.id, imageId),
          eq(images.userId, userId)
        )
      )

    if (!existingImage) {
      return NextResponse.json(
        { error: '이미지를 찾을 수 없거나 수정 권한이 없습니다.' },
        { status: 404 }
      )
    }

    // 이미지 정보 업데이트
    const [updatedImage] = await db
      .update(images)
      .set({
        artStyle: body.artStyle,
        colorTone: body.colorTone,
        tags: body.tags,
        isPublic: body.isPublic,
        updatedAt: new Date()
      })
      .where(eq(images.id, imageId))
      .returning()

    // 게시물 정보 업데이트
    let updatedPost = null
    if (body.post) {
      [updatedPost] = await db
        .update(posts)
        .set({
          title: body.post.title,
          description: body.post.description,
          updatedAt: new Date()
        })
        .where(eq(posts.imageId, imageId))
        .returning()
    }

    const response: IUpdateResponse = {
      success: true,
      image: {
        ...updatedImage,
        createdAt: updatedImage.createdAt.toISOString(),
        updatedAt: updatedImage.updatedAt.toISOString(),
        post: updatedPost ? {
          ...updatedPost,
          createdAt: updatedPost.createdAt.toISOString(),
          updatedAt: updatedPost.updatedAt.toISOString()
        } : null
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('이미지 수정 중 오류 발생:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPDATE_ERROR',
          message: '이미지 수정 중 오류가 발생했습니다.'
        }
      },
      { status: 500 }
    )
  }
}

// 이미지 삭제 API
export async function DELETE(
  request: NextRequest,
  { params }: { params: { imageId: string } }
) {
  try {
    const { userId } = getAuth(request)
    if (!userId) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      )
    }

    const imageId = parseInt(params.imageId)

    // 이미지 소유자 확인
    const [existingImage] = await db
      .select()
      .from(images)
      .where(
        and(
          eq(images.id, imageId),
          eq(images.userId, userId)
        )
      )

    if (!existingImage) {
      return NextResponse.json(
        { error: '이미지를 찾을 수 없거나 삭제 권한이 없습니다.' },
        { status: 404 }
      )
    }

    // Supabase Storage에서 이미지 삭제
    await deleteImage(existingImage.filePath)

    // 데이터베이스에서 이미지 및 관련 게시물 삭제
    await db.delete(images).where(eq(images.id, imageId))

    const response: IDeleteResponse = {
      success: true
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('이미지 삭제 중 오류 발생:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DELETE_ERROR',
          message: '이미지 삭제 중 오류가 발생했습니다.'
        }
      },
      { status: 500 }
    )
  }
} 