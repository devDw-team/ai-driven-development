import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IGalleryImage } from '@/types/gallery';
import { Download, Edit, Share2, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface ImageDetailModalProps {
  image: IGalleryImage | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (image: IGalleryImage) => void;
  onDelete: (image: IGalleryImage) => void;
  onShare: (image: IGalleryImage) => void;
  onDownload: (image: IGalleryImage) => void;
}

export function ImageDetailModal({
  image,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onShare,
  onDownload,
}: ImageDetailModalProps) {
  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{image.title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative aspect-square">
            <Image
              src={image.imageUrl}
              alt={image.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">설명</h3>
              <p className="text-muted-foreground">{image.description}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">프롬프트</h3>
              <p className="text-muted-foreground">{image.prompt}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">스타일</h3>
              <div className="flex gap-2">
                <span className="text-sm bg-secondary px-2 py-1 rounded-full">
                  {image.styleOptions.artStyle}
                </span>
                <span className="text-sm bg-secondary px-2 py-1 rounded-full">
                  {image.styleOptions.colorTone}
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">태그</h3>
              <div className="flex flex-wrap gap-2">
                {image.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                생성일: {new Date(image.createdAt).toLocaleDateString()}
              </span>
              {image.isPublic && (
                <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                  공개
                </span>
              )}
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={() => onEdit(image)}>
                <Edit className="w-4 h-4 mr-2" />
                수정
              </Button>
              <Button onClick={() => onShare(image)}>
                <Share2 className="w-4 h-4 mr-2" />
                공유
              </Button>
              <Button onClick={() => onDownload(image)}>
                <Download className="w-4 h-4 mr-2" />
                다운로드
              </Button>
              <Button variant="destructive" onClick={() => onDelete(image)}>
                <Trash2 className="w-4 h-4 mr-2" />
                삭제
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 