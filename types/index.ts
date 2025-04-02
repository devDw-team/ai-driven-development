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