import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { LayoutGrid, List, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

// 아트 스타일 옵션
const artStyleOptions = [
  { value: 'all', label: '전체' },
  { value: 'digital', label: '디지털 아트' },
  { value: 'watercolor', label: '수채화' },
  { value: 'oil', label: '유화' },
  { value: 'pen', label: '펜화' },
  { value: 'pencil', label: '연필화' },
  { value: 'logo_minimal', label: '미니멀 로고' },
  { value: 'logo_3d', label: '3D 로고' },
  { value: 'logo_gradient', label: '그라데이션 로고' },
  { value: 'logo_vintage', label: '빈티지 로고' },
  { value: 'logo_modern', label: '모던 로고' },
];

// 색상 톤 옵션
const colorToneOptions = [
  { value: 'all', label: '전체' },
  { value: 'bright', label: '밝은 톤' },
  { value: 'dark', label: '어두운 톤' },
  { value: 'pastel', label: '파스텔 톤' },
  { value: 'bw', label: '흑백' },
  { value: 'colorful', label: '화려한 톤' },
  { value: 'monotone', label: '모노톤' },
  { value: 'metallic', label: '메탈릭' },
];

interface GalleryFiltersProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  artStyle: string;
  onArtStyleChange: (style: string) => void;
  colorTone: string;
  onColorToneChange: (tone: string) => void;
  sortBy: 'latest' | 'oldest';
  onSortChange: (sort: 'latest' | 'oldest') => void;
  isPublic: boolean;
  onPublicChange: (isPublic: boolean) => void;
  onSearch: (query: string) => void;
  currentView: 'grid' | 'list';
}

export function GalleryFilters({
  viewMode,
  onViewModeChange,
  artStyle,
  onArtStyleChange,
  colorTone,
  onColorToneChange,
  sortBy,
  onSortChange,
  isPublic,
  onPublicChange,
  onSearch,
  currentView,
}: GalleryFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* 검색 영역 */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="프롬프트, 태그로 검색"
            className="pl-10"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* 필터 및 정렬 영역 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-wrap gap-4">
          <Select value={artStyle} onValueChange={onArtStyleChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="아트 스타일" />
            </SelectTrigger>
            <SelectContent>
              {artStyleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={colorTone} onValueChange={onColorToneChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="색상 톤" />
            </SelectTrigger>
            <SelectContent>
              {colorToneOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="정렬" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">최신순</SelectItem>
              <SelectItem value="oldest">오래된순</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2">
            <Switch
              id="public-mode"
              checked={isPublic}
              onCheckedChange={onPublicChange}
            />
            <Label htmlFor="public-mode">공개 이미지만</Label>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant={currentView === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onViewModeChange('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={currentView === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onViewModeChange('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 