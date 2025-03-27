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
import { useState } from 'react';

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

  if (!editedImage) return null;

  const handleSave = () => {
    onSave(editedImage);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>이미지 정보 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              value={editedImage.title}
              onChange={(e) =>
                setEditedImage({ ...editedImage, title: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              value={editedImage.description}
              onChange={(e) =>
                setEditedImage({ ...editedImage, description: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">카테고리</Label>
            <Select
              value={editedImage.category}
              onValueChange={(value) =>
                setEditedImage({ ...editedImage, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">태그</Label>
            <Input
              id="tags"
              value={editedImage.tags.join(', ')}
              onChange={(e) =>
                setEditedImage({
                  ...editedImage,
                  tags: e.target.value.split(',').map((tag) => tag.trim()),
                })
              }
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isPublic"
              checked={editedImage.isPublic}
              onCheckedChange={(checked) =>
                setEditedImage({ ...editedImage, isPublic: checked })
              }
            />
            <Label htmlFor="isPublic">공개</Label>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button onClick={handleSave}>저장</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 