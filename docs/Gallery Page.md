## 갤러리 관리 및 커뮤니티 공유 화면 기능명세서

---

### 프론트엔드 기능명세서

#### 1. 화면 레이아웃 및 디자인 명세

- **파일 위치**: `app/gallery/page.tsx`

1. **갤러리 헤더 섹션**
   - **UI 구성**: 
     - ShadCN의 `Card` 컴포넌트를 사용하여 상단에 배치
     - 갤러리 제목과 설명 텍스트

2. **필터 및 정렬 섹션**
   - **UI 구성**: 
     - 아트 스타일 필터 (Select 컴포넌트)
     - 색상 톤 필터 (Select 컴포넌트)
     - 정렬 옵션 드롭다운
     - 공개/비공개 토글 스위치
   - **필터 옵션**:
     - 카테고리: 전체('all') 및 기타 카테고리
     - 정렬: 최신순/오래된순
     - 공개/비공개 필터링
   - **상호작용**:
     - 필터 변경 시 실시간 갤러리 업데이트
     - 검색어 입력 시 실시간 필터링

3. **갤러리 그리드/리스트 뷰**
   - **UI 구성**: 
     - ShadCN의 `Card` 컴포넌트를 사용하여 이미지 카드 표시
     - 반응형 그리드 레이아웃 (모바일: 1열, 태블릿: 2열, 데스크톱: 3열)
     - 각 이미지는 1:1 비율의 카드 형태로 표시
   - **이미지 카드 구성**:
     - 썸네일 이미지 (aspect-square)
     - 생성일자
     - 공개/비공개 뱃지
   - **이미지 URL 형식**:
     ```typescript
     // 이미지 URL은 Supabase Storage를 사용하며, 다음과 같은 형식을 가집니다:
     const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${filePath}`
     ```
   - **상호작용**:
     - 카드 호버 시 액션 버튼 표시 (공유,삭제)
     - 카드 클릭 시 상세 모달 표시
     - 삭제 시 확인 다이얼로그 표시

4. **이미지 상세 모달**
   - **UI 구성**:
     - ShadCN의 `Dialog` 컴포넌트 사용
     - 원본 이미지 표시
     - 프롬프트 정보
     - 스타일 옵션 정보
     - 생성 날짜
     - 태그 관리 섹션
   - **상호작용**:
     - 모달 외부 클릭 또는 ESC 키로 닫기
     - 태그 추가/삭제
     - 각 액션 실행 시 Sonner 토스트 메시지 표시

5. **커뮤니티 공유 모달**
  - **UI 구성**:
    - 제목 입력 필드
    - 설명 입력 필드
    - 태그 입력 및 관리
    - 공유 버튼
    - **상호작용**:
    - 태그 추가/삭제
    - 입력 필드 유효성 검사
    - 공유 완료 시 토스트 메시지
    - 공개/비공개 설정

#### 2. 사용자 흐름 및 상호작용

1. **갤러리 탐색**
   - 검색어로 이미지 필터링
   - 카테고리별 필터링
   - 공개/비공개 상태로 필터링
   - 생성일자 기준 정렬

2. **이미지 관리**
   - 이미지 정보 조회
   - 이미지 정보 수정
   - 이미지 삭제 (확인 다이얼로그 표시)
   - 이미지 다운로드
   - 공개/비공개 상태 변경

3. **커뮤니티 공유**
   - 공유 버튼 클릭 → 공유 모달 열기 → 정보 입력 → 공유하기 → 완료 메시지

#### 3. 테스트 항목

1. **필터 및 검색**
   - 검색 기능 동작 확인
   - 카테고리 필터 동작 확인
   - 정렬 기능 확인
   - 공개/비공개 필터 확인

2. **갤러리 뷰**
   - 반응형 레이아웃 확인
   - 이미지 카드 호버 효과 확인
   - 액션 버튼 동작 확인

3. **이미지 상세/편집**
   - 모달 열기/닫기 동작 확인
   - 편집 모달 전환 확인
   - 태그 관리 기능 확인
   - 토스트 메시지 표시 확인

---

### 백엔드 기능명세서

#### 1. 갤러리 이미지 목록 조회 API

- **파일 위치**: `app/api/gallery/route.ts`
- **HTTP 메서드**: `GET`
- **요청 데이터**:
  ```typescript
  interface IGalleryRequest {
    page?: number;
    limit?: number;
    artStyle?: string;
    colorTone?: string;
    sortBy?: 'latest' | 'oldest';
    isPublic?: boolean;
    userId?: string; // 현재 로그인한 사용자의 이미지만 조회할 경우
  }
  ```
- **응답 데이터**:
  ```typescript
  interface IGalleryResponse {
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
  ```

#### 2. 이미지 업로드 API

- **파일 위치**: `app/api/gallery/upload/route.ts`
- **HTTP 메서드**: `POST`
- **요청 데이터**:
  ```typescript
  interface IUploadRequest {
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
  ```
- **응답 데이터**:
  ```typescript
  interface IUploadResponse {
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
  ```

#### 3. 이미지 수정 API

- **파일 위치**: `app/api/gallery/[imageId]/route.ts`
- **HTTP 메서드**: `PUT`
- **요청 데이터**:
  ```typescript
  interface IUpdateRequest {
    artStyle?: string;
    colorTone?: string;
    tags?: string[];
    isPublic?: boolean;
    post?: {
      title?: string;
      description?: string;
    };
  }
  ```
- **응답 데이터**:
  ```typescript
  interface IUpdateResponse {
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
  ```

#### 4. 이미지 삭제 API

- **파일 위치**: `app/api/gallery/[imageId]/route.ts`
- **HTTP 메서드**: `DELETE`
- **응답 데이터**:
  ```typescript
  interface IDeleteResponse {
    success: boolean;
    error?: {
      code: string;
      message: string;
    };
  }
  ```

#### 5. 커뮤니티 공유 API

- **파일 위치**: `app/api/gallery/[imageId]/share/route.ts`
- **HTTP 메서드**: `POST`
- **요청 데이터**:
  ```typescript
  interface IShareRequest {
    title: string;
    description?: string;
    tags: string[];
  }
  ```
- **응답 데이터**:
  ```typescript
  interface IShareResponse {
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
  ``` 