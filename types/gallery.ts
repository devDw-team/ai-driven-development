export interface IGalleryImage {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  prompt: string;
  styleOptions: {
    artStyle: string;
    colorTone: string;
  };
  category: string;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
}

export interface IGalleryFilter {
  category?: string;
  tags?: string[];
  sortBy?: 'latest' | 'oldest';
  isPublic?: boolean;
} 