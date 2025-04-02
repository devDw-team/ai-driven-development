import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { images, posts } from '@/db/schema'
import { eq, and, desc, asc, sql } from 'drizzle-orm'
import { IGalleryRequest, IGalleryResponse } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const artStyle = searchParams.get('artStyle')
    const colorTone = searchParams.get('colorTone')
    const sortBy = searchParams.get('sortBy') as 'latest' | 'oldest' | null
    const showPublicOnly = searchParams.get('isPublic') === 'true'
    const userId = searchParams.get('userId')

    // 기본 쿼리 조건 설정
    let conditions = []
    
    // 공개/비공개 필터링
    if (showPublicOnly) {
      conditions.push(eq(images.isPublic, true))
    }

    // 사용자 필터링
    if (userId) {
      conditions.push(eq(images.userId, userId))
    }

    // 아트 스타일 필터링
    if (artStyle) {
      conditions.push(eq(images.artStyle, artStyle))
    }

    // 컬러 톤 필터링
    if (colorTone) {
      conditions.push(eq(images.colorTone, colorTone))
    }

    // 정렬 조건 설정
    const orderBy = sortBy === 'oldest' ? asc(images.createdAt) : desc(images.createdAt)

    // 전체 이미지 수 조회
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(images)
      .where(and(...conditions))
      .then(result => result[0].count)

    // 이미지 목록 조회
    const imageList = await db
      .select({
        id: images.id,
        userId: images.userId,
        filePath: images.filePath,
        prompt: images.prompt,
        artStyle: images.artStyle,
        colorTone: images.colorTone,
        tags: images.tags,
        isPublic: images.isPublic,
        createdAt: images.createdAt,
        updatedAt: images.updatedAt,
        post: posts
      })
      .from(images)
      .leftJoin(posts, eq(images.id, posts.imageId))
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset((page - 1) * limit)

    const response: IGalleryResponse = {
      images: imageList.map(img => ({
        ...img,
        createdAt: img.createdAt.toISOString(),
        updatedAt: img.updatedAt.toISOString(),
        post: img.post ? {
          ...img.post,
          createdAt: img.post.createdAt.toISOString(),
          updatedAt: img.post.updatedAt.toISOString()
        } : null
      })),
      totalCount,
      hasMore: totalCount > page * limit
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('갤러리 목록 조회 중 오류 발생:', error)
    return NextResponse.json(
      { error: '갤러리 목록을 조회하는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 