export interface IGalleryImage {
  id: number;
  userId: string;
  filePath: string;
  title: string;
  description: string;
  prompt: string;
  artStyle: string;
  colorTone: string;
  category: string;
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
}

export interface IGalleryFilter {
  category?: string;
  tags?: string[];
  sortBy?: 'latest' | 'oldest';
  isPublic?: boolean;
} 