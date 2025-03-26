'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Loader2, RefreshCw, Save, Share2, Download } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from 'next/navigation';

// 목업 데이터
const MOCK_IMAGE_URL = "https://picsum.photos/800/600";

export default function GeneratePage() {
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState('');
  const [artStyle, setArtStyle] = useState('digital');
  const [colorTone, setColorTone] = useState('colorful');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // URL 쿼리 파라미터에서 프롬프트 가져오기
  useEffect(() => {
    const promptFromUrl = searchParams.get('prompt');
    if (promptFromUrl) {
      setPrompt(decodeURIComponent(promptFromUrl));
    }
  }, [searchParams]);

  // 스타일 옵션
  const artStyles = [
    { value: 'digital', label: '디지털아트' },
    { value: 'watercolor', label: '수채화' },
    { value: 'oil', label: '유화' },
    { value: 'pen', label: '펜화' },
    { value: 'pencil', label: '연필화' },
    { value: 'logo_minimal', label: '로고_미니멀' },
    { value: 'logo_3d', label: '로고_3D' },
    { value: 'logo_gradient', label: '로고_그라디언트' },
    { value: 'logo_vintage', label: '로고_빈티지' },
    { value: 'logo_modern', label: '로고_모던' },
  ];

  const colorTones = [
    { value: 'bright', label: '밝은' },
    { value: 'dark', label: '어두운' },
    { value: 'pastel', label: '파스텔' },
    { value: 'bw', label: '흑백' },
    { value: 'colorful', label: '컬러풀' },
    { value: 'monotone', label: '모노톤' },
    { value: 'metallic', label: '메탈릭' },
  ];

  // 이미지 생성 시뮬레이션
  const handleGenerate = async () => {
    if (!prompt) return;
    
    setIsLoading(true);
    setProgress(0);
    
    // 진행률 시뮬레이션
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          setGeneratedImage(MOCK_IMAGE_URL);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  // 생성 취소
  const handleCancel = () => {
    setIsLoading(false);
    setProgress(0);
  };

  // 다시 생성
  const handleRegenerate = () => {
    setGeneratedImage(null);
    handleGenerate();
  };

  // 저장하기 핸들러
  const handleSave = () => {
    toast.success("이미지가 갤러리에 저장되었습니다.");
  };

  // 공유하기 핸들러
  const handleShare = () => {
    toast.info("커뮤니티 공유 기능은 현재 준비 중입니다.");
  };

  // 다운로드 핸들러
  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      // 이미지 URL에서 파일명 추출
      const fileName = `artify-${Date.now()}.jpg`;
      
      // 이미지 다운로드
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      
      // Blob URL 생성
      const blobUrl = window.URL.createObjectURL(blob);
      
      // 다운로드 링크 생성 및 클릭
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // 정리
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
      toast.success("이미지가 다운로드되었습니다.");
    } catch (error) {
      toast.error("다운로드 중 오류가 발생했습니다.");
      console.error('Download error:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-8">이미지 생성</h1>
      
      {/* 프롬프트 입력 섹션 */}
      <div className="space-y-4 mb-8">
        <Textarea
          placeholder="원하는 이미지를 설명해주세요..."
          value={prompt}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
          className="min-h-[120px] resize-none"
          maxLength={500}
        />
        <div className="text-sm text-gray-500 text-right">
          {prompt.length}/500
        </div>
      </div>

      {/* 스타일 옵션 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="space-y-2">
          <label className="text-sm font-medium">아트 스타일</label>
          <Select value={artStyle} onValueChange={setArtStyle}>
            <SelectTrigger>
              <SelectValue placeholder="스타일 선택" />
            </SelectTrigger>
            <SelectContent>
              {artStyles.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">색감</label>
          <Select value={colorTone} onValueChange={setColorTone}>
            <SelectTrigger>
              <SelectValue placeholder="색감 선택" />
            </SelectTrigger>
            <SelectContent>
              {colorTones.map((tone) => (
                <SelectItem key={tone.value} value={tone.value}>
                  {tone.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 생성 버튼 */}
      <div className="flex justify-center mb-8">
        <Button
          size="lg"
          onClick={handleGenerate}
          disabled={!prompt || isLoading}
          className="w-full md:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              생성 중...
            </>
          ) : (
            '이미지 생성'
          )}
        </Button>
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="space-y-4 mb-8">
          <Progress value={progress} className="w-full" />
          <div className="text-center text-sm text-gray-500">
            이미지 생성 중... {progress}%
          </div>
          <div className="flex justify-center">
            <Button variant="outline" onClick={handleCancel}>
              취소
            </Button>
          </div>
        </div>
      )}

      {/* 생성 결과 */}
      {generatedImage && (
        <Card className="p-4">
          <div className="space-y-4">
            <img
              src={generatedImage}
              alt="Generated image"
              className="w-full rounded-lg"
            />
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={handleRegenerate}>
                <RefreshCw className="mr-2 h-4 w-4" />
                다시 생성
              </Button>
              <Button variant="outline" onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                저장하기
              </Button>
              <Button variant="outline" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                다운로드
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                커뮤니티 공유
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
} 