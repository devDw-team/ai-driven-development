import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload } from 'lucide-react';

export function GalleryHeader() {
  return (
    <Card className="p-6 mb-8">
      <h1 className="text-3xl font-bold mb-2">갤러리</h1>
      <p className="text-muted-foreground">
        생성한 이미지를 관리하고 커뮤니티와 공유해보세요.
      </p>
    </Card>
  );
} 