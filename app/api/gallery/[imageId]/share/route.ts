import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { images, posts } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { IShareRequest, IShareResponse, IErrorResponse } from '@/types'
import { getAuth } from '@clerk/nextjs/server'
import { createAuthenticatedSupabaseClient } from '@/utils/supabase-server'

export async function POST(
  request: NextRequest,
  { params }: { params: { imageId: string } }
) {
  try {
    // 1. 인증 확인
    const { userId } = getAuth(request)
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Unauthorized access',
        },
      } as IErrorResponse, { status: 401 })
    }

    // 2. 요청 데이터 검증
    const { title, description, tags }: IShareRequest = await request.json()
    if (!title || !params.imageId) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Title and imageId are required',
        },
      } as IErrorResponse, { status: 400 })
    }

    // 3. 인증된 Supabase 클라이언트 생성
    const supabaseClient = await createAuthenticatedSupabaseClient()

    // 4. 이미지 소유권 확인
    console.log('Checking image ownership:', { imageId: params.imageId, userId })
    const { data: image, error: imageError } = await supabaseClient
      .from('images')
      .select('*, posts(*)')
      .eq('id', parseInt(params.imageId))
      .eq('user_id', userId)
      .single()

    if (imageError) {
      console.error('Image query error:', imageError)
      return NextResponse.json({
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to query image',
        },
      } as IErrorResponse, { status: 500 })
    }

    if (!image) {
      console.error('Image not found:', { imageId: params.imageId, userId })
      return NextResponse.json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Image not found or unauthorized',
        },
      } as IErrorResponse, { status: 404 })
    }

    // 이미 공유된 이미지인지 확인
    if (image.posts && image.posts.length > 0) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'ALREADY_SHARED',
          message: '이미 공유된 이미지입니다.',
        },
      } as IErrorResponse, { status: 400 })
    }

    // 5. 커뮤니티 게시물 생성
    const { data: post, error: postError } = await supabaseClient
      .from('posts')
      .insert({
        image_id: params.imageId,
        user_id: userId,
        title: title,
        description: description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (postError) {
      console.error('Post creation error:', postError)
      return NextResponse.json({
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to create post',
        },
      } as IErrorResponse, { status: 500 })
    }

    // 6. 이미지 공개 상태 업데이트
    const { error: updateError } = await supabaseClient
      .from('images')
      .update({ is_public: true })
      .eq('id', params.imageId)

    if (updateError) {
      console.error('Image update error:', updateError)
      return NextResponse.json({
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to update image',
        },
      } as IErrorResponse, { status: 500 })
    }

    // 7. 성공 응답
    return NextResponse.json({
      success: true,
      post: {
        ...post,
        image: {
          filePath: image.filePath,
          prompt: image.prompt,
          artStyle: image.artStyle,
          colorTone: image.colorTone,
          tags: image.tags,
        },
      },
    } as IShareResponse, { status: 201 })
  } catch (error) {
    console.error('Share error:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    } as IErrorResponse, { status: 500 })
  }
} 