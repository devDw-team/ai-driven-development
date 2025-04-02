import { IGalleryImage } from '@/types/gallery';

export const mockGalleryImages: IGalleryImage[] = [
  {
    id: 1,
    userId: 'user1',
    filePath: 'https://picsum.photos/800/800?random=1',
    title: '우주를 향한 여정',
    description: '우주를 향해 나아가는 우주선의 모습',
    prompt: '우주선이 우주를 향해 나아가는 모습, 사이버펑크 스타일',
    artStyle: '사이버펑크',
    colorTone: '네온 블루',
    category: '우주',
    tags: ['우주', '사이버펑크', '미래'],
    isPublic: true,
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z'
  },
  {
    id: 2,
    userId: 'user1',
    filePath: 'https://picsum.photos/800/800?random=2',
    title: '도시의 밤',
    description: '도시의 야경을 표현한 작품',
    prompt: '도시의 야경, 네온 사인이 빛나는 거리',
    artStyle: '사이버펑크',
    colorTone: '네온 퍼플',
    category: '도시',
    tags: ['도시', '야경', '네온'],
    isPublic: false,
    createdAt: '2024-03-19T15:30:00Z',
    updatedAt: '2024-03-19T15:30:00Z'
  },
  {
    id: 3,
    userId: 'user1',
    filePath: 'https://picsum.photos/800/800?random=3',
    title: '자연의 아름다움',
    description: '자연의 아름다운 풍경',
    prompt: '아름다운 자연 풍경, 마법적인 분위기',
    artStyle: '판타지',
    colorTone: '파스텔',
    category: '자연',
    tags: ['자연', '풍경', '판타지'],
    isPublic: true,
    createdAt: '2024-03-18T09:15:00Z',
    updatedAt: '2024-03-18T09:15:00Z'
  }
];

export const categories = ['전체', '우주', '자연', '도시', '인물', '동물', '추상'];
export const sortOptions = [
  { value: 'latest', label: '최신순' },
  { value: 'oldest', label: '오래된순' },
]; 