'use client';

import { GalleryCard } from '@/components/gallery/GalleryCard';
import { GalleryFilters } from '@/components/gallery/GalleryFilters';
import { GalleryHeader } from '@/components/gallery/GalleryHeader';
import { ImageDetailModal } from '@/components/gallery/ImageDetailModal';
import { ImageEditModal } from '@/components/gallery/ImageEditModal';
import { ShareModal } from '@/components/gallery/ShareModal';
import { IGalleryImage } from '@/types/gallery';
import { fetchGalleryImages, updateImage, deleteImage, shareImage } from '@/utils/api';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function GalleryPage() {
  const { user } = useUser();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [artStyle, setArtStyle] = useState('all');
  const [colorTone, setColorTone] = useState('all');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest'>('latest');
  const [isPublic, setIsPublic] = useState(false);
  const [selectedImage, setSelectedImage] = useState<IGalleryImage | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [images, setImages] = useState<IGalleryImage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 이미지 목록 불러오기
  const loadImages = async (reset = false) => {
    try {
      setIsLoading(true);
      const currentPage = reset ? 1 : page;
      const response = await fetchGalleryImages({
        page: currentPage,
        limit: 12,
        artStyle: artStyle !== 'all' ? artStyle : undefined,
        colorTone: colorTone !== 'all' ? colorTone : undefined,
        sortBy,
        isPublic,
        userId: user?.id
      });

      setImages(prev => reset ? response.images : [...prev, ...response.images]);
      setHasMore(response.hasMore);
      if (reset) setPage(1);
    } catch (error) {
      toast.error('이미지를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 변경 시 이미지 다시 불러오기
  useEffect(() => {
    loadImages(true);
  }, [artStyle, colorTone, sortBy, isPublic]);

  // 무한 스크롤
  const handleScroll = () => {
    if (isLoading || !hasMore) return;
    
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      setPage(prev => prev + 1);
      loadImages();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore]);

  const handleImageClick = (image: IGalleryImage) => {
    setSelectedImage(image);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (image: IGalleryImage) => {
    setSelectedImage(image);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (image: IGalleryImage) => {
    try {
      await deleteImage(image.id);
      setImages(images.filter((img) => img.id !== image.id));
      setIsDetailModalOpen(false);
      setSelectedImage(null);
      toast.success('이미지가 삭제되었습니다.');
    } catch (error) {
      toast.error('이미지 삭제에 실패했습니다.');
    }
  };

  const handleShare = (image: IGalleryImage) => {
    setSelectedImage(image);
    setIsShareModalOpen(true);
  };

  const handleShareSubmit = async (image: IGalleryImage, title: string, description: string, tags: string[]) => {
    console.log('handleShareSubmit called with:', { image, title, description, tags })
    try {
      console.log('Calling shareImage API...')
      const response = await shareImage(image.id.toString(), {
        title,
        description,
        tags,
      })
      console.log('API response:', response)

      if (response.success) {
        toast.success('이미지가 성공적으로 공유되었습니다.')
        // 이미지 목록 새로고침
        loadImages(true)
      } else {
        throw new Error(response.error?.message || '이미지 공유에 실패했습니다.')
      }
    } catch (error) {
      console.error('Share error:', error)
      toast.error(error instanceof Error ? error.message : '이미지 공유에 실패했습니다.')
    }
  }

  const handleDownload = (image: IGalleryImage) => {
    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${image.filePath}`;
    window.open(imageUrl, '_blank');
    toast.success('이미지 다운로드가 시작되었습니다.');
  };

  const handleSave = async (image: IGalleryImage) => {
    try {
      const response = await updateImage(image.id, {
        artStyle: image.artStyle,
        colorTone: image.colorTone,
        tags: image.tags,
        isPublic: image.isPublic,
        post: image.post ? {
          title: image.post.title,
          description: image.post.description || undefined
        } : undefined
      });

      setImages(images.map((img) => (img.id === image.id ? response.image : img)));
      toast.success('이미지 정보가 수정되었습니다.');
    } catch (error) {
      toast.error('이미지 수정에 실패했습니다.');
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <GalleryHeader />
      <GalleryFilters
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        artStyle={artStyle}
        onArtStyleChange={setArtStyle}
        colorTone={colorTone}
        onColorToneChange={setColorTone}
        sortBy={sortBy}
        onSortChange={setSortBy}
        isPublic={isPublic}
        onPublicChange={setIsPublic}
        onSearch={setSearchQuery}
        currentView={viewMode}
      />
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full'
            : 'flex flex-col gap-6 max-w-4xl mx-auto w-full'
        }
      >
        {images.map((image) => (
          <div
            key={image.id}
            className={
              viewMode === 'grid'
                ? 'w-full aspect-[4/3]'
                : 'w-full'
            }
          >
            <GalleryCard
              image={image}
              onClick={handleImageClick}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onShare={!image.isPublic ? handleShare : undefined}
              onDownload={handleDownload}
            />
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {selectedImage && (
        <>
          <ImageDetailModal
            image={selectedImage}
            isOpen={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedImage(null);
            }}
            onEdit={() => {
              setIsDetailModalOpen(false);
              setIsEditModalOpen(true);
            }}
            onDelete={handleDelete}
            onShare={handleShare}
            onDownload={handleDownload}
            onUpdate={handleSave}
          />
          <ImageEditModal
            image={selectedImage}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedImage(null);
            }}
            onSave={handleSave}
          />
          <ShareModal
            image={selectedImage}
            isOpen={isShareModalOpen}
            onClose={() => {
              setIsShareModalOpen(false);
              setSelectedImage(null);
            }}
            onShare={handleShareSubmit}
          />
        </>
      )}
    </div>
  );
} 