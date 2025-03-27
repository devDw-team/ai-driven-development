import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload } from 'lucide-react';

export function GalleryHeader() {
  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">내 갤러리</h1>
          <p className="text-muted-foreground">
            생성한 이미지들을 관리하고 커뮤니티와 공유해보세요
          </p>
        </div>
        <Button>
          <Upload className="w-4 h-4 mr-2" />
          이미지 업로드
        </Button>
      </div>
    </Card>
  );
} 