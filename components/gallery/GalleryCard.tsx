import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IGalleryImage } from '@/types/gallery';
import { getImageUrl } from '@/utils/supabase';
import { Edit, Share, Trash, Download } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from "@/components/ui/badge"

interface GalleryCardProps {
  image: IGalleryImage;
  onClick: (image: IGalleryImage) => void;
  onEdit: (image: IGalleryImage) => void;
  onDelete: (image: IGalleryImage) => void;
  onShare?: (image: IGalleryImage) => void;
  onDownload: (image: IGalleryImage) => void;
}

export function GalleryCard({
  image,
  onClick,
  onEdit,
  onDelete,
  onShare,
  onDownload,
}: GalleryCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const imageUrl = getImageUrl(image.filePath);

  const handleDelete = () => {
    onDelete(image);
    setIsDeleteDialogOpen(false);
    toast.success('이미지가 삭제되었습니다.', {
      description: '갤러리에서 이미지가 제거되었습니다.',
    });
  };

  return (
    <>
      <Card className="group relative overflow-hidden cursor-pointer" onClick={() => onClick(image)}>
        <CardContent className="p-0">
          <div className="relative aspect-square">
            <Image
              src={imageUrl}
              alt={image.prompt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(image);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              {onShare && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare(image);
                  }}
                >
                  <Share className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(image);
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(image);
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-500 truncate">{image.prompt}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-400">
                {new Date(image.createdAt).toLocaleDateString()}
              </span>
              {image.isPublic && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  공개
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>이미지 삭제</DialogTitle>
            <DialogDescription>
              정말로 이 이미지를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 