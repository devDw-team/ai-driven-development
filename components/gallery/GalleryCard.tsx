import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IGalleryImage } from '@/types/gallery';
import { Edit, Share2, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface GalleryCardProps {
  image: IGalleryImage;
  onEdit: (image: IGalleryImage) => void;
  onDelete: (image: IGalleryImage) => void;
  onShare: (image: IGalleryImage) => void;
}

export function GalleryCard({
  image,
  onEdit,
  onDelete,
  onShare,
}: GalleryCardProps) {
  return (
    <Card className="group relative overflow-hidden">
      <div className="aspect-square relative">
        <Image
          src={image.imageUrl}
          alt={image.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => onEdit(image)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => onShare(image)}
          >
            <Share2 className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => onDelete(image)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-1">{image.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {image.description}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-muted-foreground">
            {new Date(image.createdAt).toLocaleDateString()}
          </span>
          {image.isPublic && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              공개
            </span>
          )}
        </div>
      </div>
    </Card>
  );
} 