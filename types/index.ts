export interface IPost {
  postId: string;
  imageURL: string;
  userName: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  prompt: string;
  createdAt: string;
  userProfile: string;
}

export interface IComment {
  id: string;
  postId: string;
  userName: string;
  content: string;
  createdAt: string;
  userProfile: string;
}

export interface IGenerateRequest {
  prompt: string;
  styleOptions: {
    artStyle: string;
    colorTone: string;
  };
  userId: string;
}

export interface IGenerateResponse {
  success: boolean;
  imageUrl: string;
  generationId: string;
}

export interface IErrorResponse {
  success: boolean;
  error: {
    code: string;
    message: string;
  };
}

export interface ICommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  comments: IComment[];
  onAddComment: (content: string) => void;
}

export interface IPostCardProps {
  post: IPost;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
}

// 갤러리 API 인터페이스
export interface IGalleryRequest {
  page?: number;
  limit?: number;
  artStyle?: string;
  colorTone?: string;
  sortBy?: 'latest' | 'oldest';
  isPublic?: boolean;
  userId?: string;
}

export interface IGalleryResponse {
  images: Array<{
    id: number;
    userId: string;
    filePath: string;
    prompt: string;
    artStyle: string;
    colorTone: string;
    tags: string[];
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
    post?: {
      id: number;
      title: string;
      description: string | null;
      createdAt: string;
      updatedAt: string;
    } | null;
  }>;
  totalCount: number;
  hasMore: boolean;
}

export interface IUploadRequest {
  image: File;
  prompt: string;
  artStyle: string;
  colorTone: string;
  tags: string[];
  isPublic: boolean;
  post?: {
    title: string;
    description?: string;
  };
}

export interface IUploadResponse {
  success: boolean;
  image?: {
    id: number;
    userId: string;
    filePath: string;
    prompt: string;
    artStyle: string;
    colorTone: string;
    tags: string[];
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
    post?: {
      id: number;
      title: string;
      description: string | null;
      createdAt: string;
      updatedAt: string;
    } | null;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface IUpdateRequest {
  artStyle?: string;
  colorTone?: string;
  tags?: string[];
  isPublic?: boolean;
  post?: {
    title?: string;
    description?: string;
  };
}

export interface IUpdateResponse {
  success: boolean;
  image?: {
    id: number;
    userId: string;
    filePath: string;
    prompt: string;
    artStyle: string;
    colorTone: string;
    tags: string[];
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
    post?: {
      id: number;
      title: string;
      description: string | null;
      createdAt: string;
      updatedAt: string;
    } | null;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface IDeleteResponse {
  success: boolean;
  error?: {
    code: string;
    message: string;
  };
}

export interface IShareRequest {
  title: string;
  description?: string;
  tags: string[];
}

export interface IShareResponse {
  success: boolean;
  post?: {
    id: number;
    imageId: number;
    userId: string;
    title: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    image: {
      filePath: string;
      prompt: string;
      artStyle: string;
      colorTone: string;
      tags: string[];
    };
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface IGalleryImage {
  id: number
  userId: string
  filePath: string
  prompt: string
  artStyle: string
  colorTone: string
  tags: string[]
  isPublic: boolean
  createdAt: string
  updatedAt: string
  post?: {
    id: number
    title: string
    description: string | null
    createdAt: string
    updatedAt: string
  } | null
} 