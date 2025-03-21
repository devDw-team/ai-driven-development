'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function PromptInput() {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    if (!prompt.trim()) {
      setError('프롬프트를 입력해 주세요');
      return;
    }
    router.push(`/generate?prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 p-4">
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="상상하는 이미지를 설명해주세요..."
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            setError('');
          }}
          className="h-12 text-lg"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
      <Button
        onClick={handleSubmit}
        disabled={!prompt.trim()}
        className="w-full h-12 text-lg"
      >
        이미지 생성하기
      </Button>
    </div>
  );
} 