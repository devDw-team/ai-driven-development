import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { IGalleryImage } from '@/types/gallery';
import { Download, Edit, Plus, Share2, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ImageEditModal } from './ImageEditModal';

interface ImageDetailModalProps {
  image: IGalleryImage | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (image: IGalleryImage) => void;
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

  const handleSave = () => {
    onUpdate(editedImage);
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative aspect-square w-full">
              <Image
                src={editedImage.imageUrl}
                alt={editedImage.title}
                fill
                className="object-cover rounded-lg shadow-lg"
                priority
              />
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">설명</h3>
                <p className="text-muted-foreground text-base">{editedImage.description}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">프롬프트</h3>
                <p className="text-muted-foreground text-base">{editedImage.prompt}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">스타일</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm bg-secondary px-3 py-1.5 rounded-full">
                    {editedImage.styleOptions.artStyle}
                  </span>
                  <span className="text-sm bg-secondary px-3 py-1.5 rounded-full">
                    {editedImage.styleOptions.colorTone}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">태그</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {editedImage.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full flex items-center gap-1.5"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-primary/80 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
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
                    className="shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    생성일: {new Date(editedImage.createdAt).toLocaleDateString()}
                  </span>
                  {editedImage.isPublic && (
                    <span className="text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                      공개
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={editedImage.isPublic}
                    onCheckedChange={handlePublicChange}
                    id="public-toggle"
                  />
                  <label htmlFor="public-toggle" className="text-sm font-medium">
                    공개 설정
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-6 mt-6 border-t sticky bottom-0 bg-background">
            <Button onClick={() => setIsEditModalOpen(true)} size="lg">
              <Edit className="w-4 h-4 mr-2" />
              수정
            </Button>
            <Button onClick={() => onShare(editedImage)} size="lg">
              <Share2 className="w-4 h-4 mr-2" />
              공유
            </Button>
            <Button onClick={() => onDownload(editedImage)} size="lg">
              <Download className="w-4 h-4 mr-2" />
              다운로드
            </Button>
            <Button variant="destructive" onClick={() => onDelete(editedImage)} size="lg">
              <Trash2 className="w-4 h-4 mr-2" />
              삭제
            </Button>
          </div>
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