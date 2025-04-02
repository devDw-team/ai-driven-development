import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Image from "next/image"
import { Share2, Trash2 } from "lucide-react"
import { IGalleryImage } from "@/types"

interface GalleryImageCardProps {
  image: IGalleryImage
  onShare: (image: IGalleryImage) => void
  onDelete: (image: IGalleryImage) => void
}

export function GalleryImageCard({ image, onShare, onDelete }: GalleryImageCardProps) {
  return (
    <Card className="group relative overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <Image
            src={image.filePath}
            alt={image.prompt}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-4 right-4 flex gap-2">
              {!image.isPublic && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => onShare(image)}
                        disabled={!!image.post}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {image.post ? "이미 공유된 이미지입니다" : "커뮤니티에 공유하기"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onDelete(image)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 