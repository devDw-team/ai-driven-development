import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { IGalleryImage } from '@/types/gallery';
import { Download, Edit, Plus, Share2, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ImageEditModal } from './ImageEditModal';
import { Badge } from "@/components/ui/badge"
import { getImageUrl } from '@/utils/supabase';
import { toast } from 'sonner';

interface ImageDetailModalProps {
  image: IGalleryImage;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: (image: IGalleryImage) => void;
  onShare: (image: IGalleryImage) => void;
  onDownload: (image: IGalleryImage) => void;
  onUpdate: (image: IGalleryImage) => void;
}

export function ImageDetailModal({
  image,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onShare,
  onDownload,
  onUpdate,
}: ImageDetailModalProps) {
  const [editedImage, setEditedImage] = useState<IGalleryImage | null>(image);
  const [newTag, setNewTag] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const imageUrl = getImageUrl(image.filePath);

  useEffect(() => {
    setEditedImage(image);
  }, [image]);

  if (!editedImage) return null;

  const handleAddTag = () => {
    if (newTag.trim() && !editedImage.tags.includes(newTag.trim())) {
      setEditedImage({
        ...editedImage,
        tags: [...editedImage.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedImage({
      ...editedImage,
      tags: editedImage.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handlePublicChange = (checked: boolean) => {
    setEditedImage({
      ...editedImage,
      isPublic: checked,
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const response = await fetch(`/api/gallery/${editedImage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tags: editedImage.tags,
          isPublic: editedImage.isPublic,
        }),
      });

      if (!response.ok) {
        throw new Error('이미지 업데이트에 실패했습니다.');
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success('이미지가 성공적으로 업데이트되었습니다.');
        onUpdate(editedImage);
        onClose();
      } else {
        throw new Error(data.error?.message || '이미지 업데이트에 실패했습니다.');
      }
    } catch (error) {
      console.error('이미지 업데이트 중 오류 발생:', error);
      toast.error('이미지 업데이트에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSave = (updatedImage: IGalleryImage) => {
    setEditedImage(updatedImage);
    onUpdate(updatedImage);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-[95vw] p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold">{editedImage.title}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative aspect-square">
              <Image
                src={imageUrl}
                alt={editedImage.title}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">{editedImage.title}</h2>
                <p className="text-muted-foreground">{editedImage.description}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">프롬프트</h3>
                  <p className="text-sm text-muted-foreground">{editedImage.prompt}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">스타일 옵션</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{editedImage.artStyle}</Badge>
                    <Badge variant="outline">{editedImage.colorTone}</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">태그</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editedImage.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="새 태그 입력"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddTag();
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleAddTag}
                      disabled={!newTag.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={editedImage.isPublic}
                    onCheckedChange={handlePublicChange}
                  />
                  <span className="text-sm">
                    {editedImage.isPublic ? '공개' : '비공개'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? '저장 중...' : '저장'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ImageEditModal
        image={editedImage}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditSave}
      />
    </>
  );
} 