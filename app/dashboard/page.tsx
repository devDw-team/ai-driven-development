import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '대시보드 | AI 이미지 생성',
  description: 'AI를 사용하여 이미지를 생성하는 대시보드입니다.',
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">대시보드</h1>
      <div className="grid gap-6">
        {/* 여기에 대시보드 컨텐츠를 추가할 수 있습니다 */}
      </div>
    </div>
  )
}

/*
const handleGenerate = async () => {
  if (!prompt.trim()) {
    toast({
      title: "프롬프트를 입력해주세요",
      description: "이미지 생성을 위한 프롬프트를 입력해주세요.",
      variant: "destructive",
    });
    return;
  }

  if (!user?.id) {
    toast({
      title: "로그인이 필요합니다",
      description: "이미지 생성을 위해 로그인해주세요.",
      variant: "destructive",
    });
    return;
  }

  setIsGenerating(true);
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        styleOptions: {
          artStyle: selectedArtStyle,
          colorTone: selectedColorTone,
        },
        userId: user.id,
      }),
    });
  } catch (error) {
    console.error('Error generating image:', error);
    toast({
      title: "이미지 생성 중 오류가 발생했습니다",
      description: "다시 시도해주세요.",
      variant: "destructive",
    });
  } finally {
    setIsGenerating(false);
  }
}; */