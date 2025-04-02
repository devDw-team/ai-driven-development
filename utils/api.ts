// 갤러리 API 호출 함수들
export async function fetchGalleryImages(params: {
  page?: number;
  limit?: number;
  artStyle?: string;
  colorTone?: string;
  sortBy?: 'latest' | 'oldest';
  isPublic?: boolean;
  userId?: string;
}) {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.artStyle) searchParams.append('artStyle', params.artStyle);
  if (params.colorTone) searchParams.append('colorTone', params.colorTone);
  if (params.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params.isPublic !== undefined) searchParams.append('isPublic', params.isPublic.toString());
  if (params.userId) searchParams.append('userId', params.userId);

  const response = await fetch(`/api/gallery?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error('갤러리 이미지를 불러오는데 실패했습니다.');
  }
  return response.json();
}

export async function updateImage(imageId: number, data: {
  artStyle?: string;
  colorTone?: string;
  tags?: string[];
  isPublic?: boolean;
  post?: {
    title?: string;
    description?: string;
  };
}) {
  const response = await fetch(`/api/gallery/${imageId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('이미지 수정에 실패했습니다.');
  }
  return response.json();
}

export async function deleteImage(imageId: number) {
  const response = await fetch(`/api/gallery/${imageId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('이미지 삭제에 실패했습니다.');
  }
  return response.json();
}

export async function shareImage(
  imageId: string,
  data: {
    title: string;
    description?: string;
    tags: string[];
  }
) {
  const response = await fetch(`/api/gallery/${imageId}/share`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || '이미지 공유에 실패했습니다.');
  }

  return response.json();
} 