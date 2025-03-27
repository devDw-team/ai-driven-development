import { IGalleryImage } from '@/types/gallery';

export const mockGalleryImages: IGalleryImage[] = [
  {
    id: '1',
    imageUrl: 'https://picsum.photos/400/400',
    title: '우주를 향한 여정',
    description: '우주를 탐험하는 우주선의 모습을 표현했습니다.',
    prompt: '우주선이 은하수를 탐험하는 모습, 디지털아트',
    styleOptions: {
      artStyle: '디지털아트',
      colorTone: '컬러풀',
    },
    category: '우주',
    tags: ['우주', '우주선', '은하수'],
    isPublic: true,
    createdAt: '2024-03-20T10:00:00Z',
  },
  {
    id: '2',
    imageUrl: 'https://picsum.photos/400/401',
    title: '고요한 호수',
    description: '아침 안개가 낀 호수의 평화로운 모습',
    prompt: '안개가 낀 호수, 수채화',
    styleOptions: {
      artStyle: '수채화',
      colorTone: '파스텔',
    },
    category: '자연',
    tags: ['호수', '안개', '아침'],
    isPublic: false,
    createdAt: '2024-03-19T15:30:00Z',
  },
  {
    id: '3',
    imageUrl: 'https://picsum.photos/400/402',
    title: '도시의 밤',
    description: '도시의 야경을 표현한 작품',
    prompt: '도시 야경, 디지털아트',
    styleOptions: {
      artStyle: '디지털아트',
      colorTone: '어두운',
    },
    category: '도시',
    tags: ['도시', '야경', '빛'],
    isPublic: true,
    createdAt: '2024-03-18T20:15:00Z',
  },
  // 더 많은 목업 데이터 추가...
];

export const categories = ['전체', '우주', '자연', '도시', '인물', '동물', '추상'];
export const sortOptions = [
  { value: 'latest', label: '최신순' },
  { value: 'oldest', label: '오래된순' },
]; 