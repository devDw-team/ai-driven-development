'use client';

import { GalleryCard } from '@/components/gallery/GalleryCard';
import { GalleryFilters } from '@/components/gallery/GalleryFilters';
import { GalleryHeader } from '@/components/gallery/GalleryHeader';
import { ImageDetailModal } from '@/components/gallery/ImageDetailModal';
import { ImageEditModal } from '@/components/gallery/ImageEditModal';
import { IGalleryImage } from '@/types/gallery';
import { mockGalleryImages } from '@/lib/mock/gallery';
import { useState } from 'react';

export default function GalleryPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [isPublic, setIsPublic] = useState(false);
  const [selectedImage, setSelectedImage] = useState<IGalleryImage | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [images, setImages] = useState<IGalleryImage[]>(mockGalleryImages);
  const [searchQuery, setSearchQuery] = useState('');

  // 목업 데이터 필터링 및 정렬
  const filteredImages = images
    .filter((image) => {
      if (category === 'all') return true;
      return image.category === category;
    })
    .filter((image) => {
      if (!isPublic) return true;
      return image.isPublic;
    })
    .filter((image) => {
      if (!searchQuery) return true;
      return image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             image.description.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  const handleImageClick = (image: IGalleryImage) => {
    setSelectedImage(image);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (image: IGalleryImage) => {
    setSelectedImage(image);
    setIsEditModalOpen(true);
  };

  const handleDelete = (image: IGalleryImage) => {
    // TODO: 삭제 API 연동
    console.log('Delete image:', image);
    setImages(images.filter((img) => img.id !== image.id));
    setIsDetailModalOpen(false);
    setSelectedImage(null);
  };

  const handleShare = (image: IGalleryImage) => {
    // TODO: 공유 API 연동
    console.log('Share image:', image);
  };

  const handleDownload = (image: IGalleryImage) => {
    // TODO: 다운로드 기능 구현
    console.log('Download image:', image);
  };

  const handleSave = (image: IGalleryImage) => {
    // TODO: 수정 API 연동
    console.log('Save image:', image);
    setImages(
      images.map((img) => (img.id === image.id ? image : img))
    );
  };

  const handleUpdate = (image: IGalleryImage) => {
    handleSave(image);
  };

  return (
    <div className="container py-8">
      <GalleryHeader />
      <GalleryFilters
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        category={category}
        onCategoryChange={setCategory}
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
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }
      >
        {filteredImages.map((image) => (
          <GalleryCard
            key={image.id}
            image={image}
            onClick={handleImageClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onShare={handleShare}
          />
        ))}
      </div>

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
            onUpdate={handleUpdate}
          />
          <ImageEditModal
            image={selectedImage}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedImage(null);
            }}
            onSave={handleUpdate}
          />
        </>
      )}
    </div>
  );
} 