import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { IGenerateRequest, IGenerateResponse, IErrorResponse } from '@/types';
import { images } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';

// Replicate 클라이언트 초기화
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Supabase 클라이언트 초기화
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    // 1. 요청 데이터 검증
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'CONFIGURATION_ERROR',
          message: 'Replicate API token is not configured',
        },
      } as IErrorResponse, { status: 500 });
    }

    // 2. Clerk 인증 확인 및 토큰 가져오기
    const clerk = await auth();
    if (!clerk.userId) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Unauthorized access',
        },
      } as IErrorResponse, { status: 401 });
    }

    // 3. Clerk 토큰을 Supabase JWT로 변환
    const clerkToken = await clerk.getToken({ template: 'supabase' });
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${clerkToken}`,
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          },
        },
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    // 4. 요청 바디 파싱
    const { prompt, styleOptions, userId }: IGenerateRequest = await request.json();

    if (!prompt || !userId) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Prompt and userId are required',
        },
      } as IErrorResponse, { status: 400 });
    }

    // 5. 프롬프트 가공 (스타일 옵션 포함)
    const stylePrompt = {
      digital: "digital art style, high quality, detailed",
      watercolor: "watercolor painting style, artistic, flowing",
      oil: "oil painting style, textured, rich colors",
      pen: "pen and ink style, clean lines, detailed",
      pencil: "pencil sketch style, artistic, detailed",
      logo_minimal: "minimalist logo design, clean, simple",
      logo_3d: "3D logo design, modern, depth",
      logo_gradient: "gradient logo design, modern, colorful",
      logo_vintage: "vintage logo design, retro style",
      logo_modern: "modern logo design, contemporary",
    };

    const colorPrompt = {
      bright: "bright and vibrant colors",
      dark: "dark and moody colors",
      pastel: "pastel color palette, soft",
      bw: "black and white, monochrome",
      colorful: "colorful and vibrant palette",
      monotone: "monotone color scheme",
      metallic: "metallic colors, shiny",
    };

    const enhancedPrompt = `${prompt}, ${stylePrompt[styleOptions.artStyle as keyof typeof stylePrompt]}, ${colorPrompt[styleOptions.colorTone as keyof typeof colorPrompt]}`;

    // 6. Replicate API 호출
    const prediction = await replicate.predictions.create({
      model: 'black-forest-labs/flux-schnell',
      input: {
        prompt: enhancedPrompt,
        aspect_ratio: '1:1',
        num_outputs: 1,
        output_format: 'webp',
        output_quality: 90,
      },
    });

    // 7. 생성 상태 폴링
    let finalPrediction = prediction;
    while (
      finalPrediction.status !== 'succeeded' && 
      finalPrediction.status !== 'failed'
    ) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      finalPrediction = await replicate.predictions.get(prediction.id);
    }

    // 8. 실패 처리
    if (finalPrediction.status === 'failed') {
      return NextResponse.json({
        success: false,
        error: {
          code: 'GENERATION_FAILED',
          message: 'Failed to generate image',
        },
      } as IErrorResponse, { status: 500 });
    }

    // 9. 이미지 URL에서 이미지 데이터 다운로드
    const imageResponse = await fetch(finalPrediction.output[0]);
    const imageBuffer = await imageResponse.arrayBuffer();

    // 10. 파일 경로 생성
    const fileUuid = uuidv4();
    const filePath = `${userId}/${fileUuid}.webp`;

    // 11. Supabase Storage에 이미지 업로드
    const { error: uploadError } = await supabaseClient.storage
      .from('images')
      .upload(filePath, imageBuffer, {
        contentType: 'image/webp',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json({
        success: false,
        error: {
          code: 'STORAGE_ERROR',
          message: 'Failed to upload image to storage',
        },
      } as IErrorResponse, { status: 500 });
    }

    // 12. 데이터베이스에 메타데이터 저장
    const { error: dbError } = await supabaseClient
      .from('images')
      .insert({
        userId,
        filePath,
        prompt,
        artStyle: styleOptions.artStyle,
        colorTone: styleOptions.colorTone,
        tags: [], // 기본값으로 빈 배열 설정
        isPublic: false
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to save image metadata',
        },
      } as IErrorResponse, { status: 500 });
    }

    // 13. 성공 응답
    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${filePath}`;
    
    return NextResponse.json({
      success: true,
      imageUrl,
      generationId: finalPrediction.id,
    } as IGenerateResponse, { status: 201 });

  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    } as IErrorResponse, { status: 500 });
  }
} 