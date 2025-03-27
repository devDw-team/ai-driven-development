import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { IGalleryImage } from '@/types/gallery';
import { categories } from '@/lib/mock/gallery';
import { useEffect, useState } from 'react';

interface ImageEditModalProps {
  image: IGalleryImage | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (image: IGalleryImage) => void;
}

export function ImageEditModal({
  image,
  isOpen,
  onClose,
  onSave,
}: ImageEditModalProps) {
  const [editedImage, setEditedImage] = useState<IGalleryImage | null>(image);

  useEffect(() => {
    setEditedImage(image);
  }, [image]);

  if (!editedImage) return null;

  const handleChange = (
    field: keyof IGalleryImage,
    value: string | boolean | string[]
  ) => {
    setEditedImage((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleSave = () => {
    if (editedImage) {
      onSave(editedImage);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">이미지 정보 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              value={editedImage.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="이미지 제목을 입력하세요"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <Input
              id="description"
              value={editedImage.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="이미지 설명을 입력하세요"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">카테고리</Label>
            <Input
              id="category"
              value={editedImage.category}
              onChange={(e) => handleChange('category', e.target.value)}
              placeholder="카테고리를 입력하세요"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">태그</Label>
            <Input
              id="tags"
              value={editedImage.tags.join(', ')}
              onChange={(e) =>
                handleChange(
                  'tags',
                  e.target.value.split(',').map((tag) => tag.trim())
                )
              }
              placeholder="태그를 쉼표로 구분하여 입력하세요"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="isPublic">공개 설정</Label>
            <Switch
              id="isPublic"
              checked={editedImage.isPublic}
              onCheckedChange={(checked) => handleChange('isPublic', checked)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSave}>저장</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 