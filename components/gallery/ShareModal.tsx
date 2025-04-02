import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { IGalleryImage } from "@/types/gallery"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { toast } from "sonner"

interface ShareModalProps {
  image: IGalleryImage
  isOpen: boolean
  onClose: () => void
  onShare: (image: IGalleryImage, title: string, description: string, tags: string[]) => void
}

export function ShareModal({
  image,
  isOpen,
  onClose,
  onShare
}: ShareModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])

  // 모달이 열릴 때 이미지의 기존 태그를 로드
  useEffect(() => {
    if (isOpen) {
      setTags(image.tags || [])
    }
  }, [isOpen, image.tags])

  const handleShare = () => {
    if (!title.trim()) {
      toast.error('제목을 입력해주세요')
      return
    }
    onShare(image, title, description, tags)
    onClose()
  }

  const handleAddTag = () => {
    if (tagInput.trim()) {
      if (tags.includes(tagInput.trim())) {
        toast.error('이미 추가된 태그입니다')
        return
      }
      if (tags.length >= 5) {
        toast.error('태그는 최대 5개까지 추가할 수 있습니다')
        return
      }
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>커뮤니티에 공유하기</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="공유할 제목을 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="공유할 설명을 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">태그 (최대 5개)</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="태그를 입력하고 Enter를 누르세요"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || tags.length >= 5}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
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
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleShare} disabled={!title.trim()}>
            공유하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 