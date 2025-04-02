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
}; 