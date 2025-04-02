import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { images, posts } from '@/db/schema'
import { uploadImage } from '@/utils/supabase'
import { IUploadRequest, IUploadResponse } from '@/types'
import { getAuth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request)
    if (!userId) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const image = formData.get('image') as File
    const prompt = formData.get('prompt') as string
    const artStyle = formData.get('artStyle') as string
    const colorTone = formData.get('colorTone') as string
    const tags = JSON.parse(formData.get('tags') as string) as string[]
    const isPublic = formData.get('isPublic') === 'true'
    const postTitle = formData.get('postTitle') as string
    const postDescription = formData.get('postDescription') as string

    // 이미지 업로드
    const filePath = await uploadImage(image, userId)

    // 이미지 정보 저장
    const [imageRecord] = await db
      .insert(images)
      .values({
        userId,
        filePath,
        prompt,
        artStyle,
        colorTone,
        tags,
        isPublic
      })
      .returning()

    // 게시물 정보가 있는 경우 저장
    let postRecord = null
    if (postTitle) {
      [postRecord] = await db
        .insert(posts)
        .values({
          imageId: imageRecord.id,
          userId,
          title: postTitle,
          description: postDescription || null
        })
        .returning()
    }

    const response: IUploadResponse = {
      success: true,
      image: {
        ...imageRecord,
        createdAt: imageRecord.createdAt.toISOString(),
        updatedAt: imageRecord.updatedAt.toISOString(),
        post: postRecord ? {
          ...postRecord,
          createdAt: postRecord.createdAt.toISOString(),
          updatedAt: postRecord.updatedAt.toISOString()
        } : null
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('이미지 업로드 중 오류 발생:', error)
    return NextResponse.json(
      { 
        success: false,
        error: {
          code: 'UPLOAD_ERROR',
          message: '이미지 업로드 중 오류가 발생했습니다.'
        }
      },
      { status: 500 }
    )
  }
} 