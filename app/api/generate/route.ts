import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import { IGenerateRequest, IGenerateResponse, IErrorResponse } from '@/types';

// Replicate 클라이언트 초기화
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

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

    // 2. 요청 바디 파싱
    const { prompt, styleOptions }: IGenerateRequest = await request.json();

    if (!prompt) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_PROMPT',
          message: 'Prompt is required',
        },
      } as IErrorResponse, { status: 400 });
    }

    // 3. 프롬프트 가공 (스타일 옵션 포함)
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

    // 4. Replicate API 호출
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

    // 5. 생성 상태 폴링
    let finalPrediction = prediction;
    while (
      finalPrediction.status !== 'succeeded' && 
      finalPrediction.status !== 'failed'
    ) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      finalPrediction = await replicate.predictions.get(prediction.id);
    }

    // 6. 실패 처리
    if (finalPrediction.status === 'failed') {
      return NextResponse.json({
        success: false,
        error: {
          code: 'GENERATION_FAILED',
          message: 'Failed to generate image',
        },
      } as IErrorResponse, { status: 500 });
    }

    // 7. 성공 응답
    return NextResponse.json({
      success: true,
      imageUrl: finalPrediction.output[0],
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