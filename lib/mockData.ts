import { IPost, IComment } from '@/types';

export const mockPosts: IPost[] = [
  {
    postId: '1',
    imageURL: 'https://picsum.photos/400/400?random=1',
    userName: '김민수',
    likes: 150,
    comments: 23,
    isLiked: false,
    prompt: '우주를 여행하는 고양이',
    createdAt: '2024-03-24T10:00:00Z',
    userProfile: 'https://i.pravatar.cc/150?img=1'
  },
  {
    postId: '2',
    imageURL: 'https://picsum.photos/400/400?random=2',
    userName: '이지은',
    likes: 89,
    comments: 12,
    isLiked: true,
    prompt: '미래도시의 일상',
    createdAt: '2024-03-24T09:30:00Z',
    userProfile: 'https://i.pravatar.cc/150?img=2'
  },
  {
    postId: '3',
    imageURL: 'https://picsum.photos/400/400?random=3',
    userName: '박준호',
    likes: 234,
    comments: 45,
    isLiked: false,
    prompt: '판타지 세계의 마법사',
    createdAt: '2024-03-24T09:00:00Z',
    userProfile: 'https://i.pravatar.cc/150?img=3'
  },
  {
    postId: '4',
    imageURL: 'https://picsum.photos/400/400?random=4',
    userName: '최유진',
    likes: 167,
    comments: 28,
    isLiked: true,
    prompt: '사이버펑크 스타일의 로봇',
    createdAt: '2024-03-24T08:30:00Z',
    userProfile: 'https://i.pravatar.cc/150?img=4'
  },
  {
    postId: '5',
    imageURL: 'https://picsum.photos/400/400?random=5',
    userName: '정다운',
    likes: 312,
    comments: 56,
    isLiked: false,
    prompt: '환상적인 수중 도시',
    createdAt: '2024-03-24T08:00:00Z',
    userProfile: 'https://i.pravatar.cc/150?img=5'
  },
  {
    postId: '6',
    imageURL: 'https://picsum.photos/400/400?random=6',
    userName: '한소희',
    likes: 423,
    comments: 67,
    isLiked: true,
    prompt: '꽃으로 가득한 정원',
    createdAt: '2024-03-24T07:30:00Z',
    userProfile: 'https://i.pravatar.cc/150?img=6'
  },
  {
    postId: '7',
    imageURL: 'https://picsum.photos/400/400?random=7',
    userName: '강민재',
    likes: 198,
    comments: 34,
    isLiked: false,
    prompt: '스팀펑크 기차역',
    createdAt: '2024-03-24T07:00:00Z',
    userProfile: 'https://i.pravatar.cc/150?img=7'
  },
  {
    postId: '8',
    imageURL: 'https://picsum.photos/400/400?random=8',
    userName: '윤서연',
    likes: 276,
    comments: 41,
    isLiked: true,
    prompt: '신비로운 숲속의 요정',
    createdAt: '2024-03-24T06:30:00Z',
    userProfile: 'https://i.pravatar.cc/150?img=8'
  },
  {
    postId: '9',
    imageURL: 'https://picsum.photos/400/400?random=9',
    userName: '임재현',
    likes: 145,
    comments: 19,
    isLiked: false,
    prompt: '레트로 스타일의 카페',
    createdAt: '2024-03-24T06:00:00Z',
    userProfile: 'https://i.pravatar.cc/150?img=9'
  },
  {
    postId: '10',
    imageURL: 'https://picsum.photos/400/400?random=10',
    userName: '송하은',
    likes: 389,
    comments: 52,
    isLiked: true,
    prompt: '미래의 플라잉카',
    createdAt: '2024-03-24T05:30:00Z',
    userProfile: 'https://i.pravatar.cc/150?img=10'
  }
];

export const mockComments: IComment[] = [
  {
    id: '1',
    postId: '1',
    userName: '홍길동',
    content: '정말 멋진 작품이네요!',
    createdAt: '2024-03-24T10:30:00Z',
    userProfile: 'https://i.pravatar.cc/150?img=11'
  },
  {
    id: '2',
    postId: '1',
    userName: '김철수',
    content: '고양이가 너무 귀여워요',
    createdAt: '2024-03-24T10:35:00Z',
    userProfile: 'https://i.pravatar.cc/150?img=12'
  },
  {
    id: '3',
    postId: '2',
    userName: '이영희',
    content: '미래도시의 분위기가 너무 좋아요',
    createdAt: '2024-03-24T09:40:00Z',
    userProfile: 'https://i.pravatar.cc/150?img=13'
  }
]; 