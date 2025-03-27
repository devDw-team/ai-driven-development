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
     - 검색 입력 필드 (이미지 제목 및 설명 검색)
     - 카테고리 선택 드롭다운
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
   - **이미지 카드 구성**:
     - 썸네일 이미지 (aspect-square)
     - 제목과 설명 (2줄 제한)
     - 생성일자
     - 공개/비공개 뱃지
     - 액션 버튼 (수정, 공유, 삭제)
   - **상호작용**:
     - 카드 호버 시 오버레이와 액션 버튼 표시
     - 이미지 클릭 시 상세 모달 표시

4. **이미지 상세 모달**
   - **UI 구성**:
     - ShadCN의 `Dialog` 컴포넌트 사용
     - 큰 크기의 이미지 표시
     - 제목 및 설명
     - 태그 관리 섹션
     - 공개/비공개 설정
   - **액션 버튼**:
     - 수정 (Edit 아이콘)
     - 삭제 (Trash2 아이콘)
     - 공유 (Share2 아이콘)
     - 다운로드 (Download 아이콘)
   - **상호작용**:
     - 모달 외부 클릭 또는 ESC 키로 닫기
     - 수정 버튼 클릭 시 편집 모달로 전환
     - 각 액션 실행 시 Sonner 토스트 메시지 표시

5. **이미지 편집 모달**
   - **UI 구성**:
     - ShadCN의 `Dialog` 컴포넌트 사용
     - 이미지 미리보기
     - 제목 및 설명 편집
     - 태그 관리 (추가/삭제)
     - 공개/비공개 토글
   - **상호작용**:
     - 저장 시 상세 모달로 돌아가기
     - 취소 시 변경사항 폐기

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
   - 준비 중 메시지 표시 (Sonner 토스트)

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
    category?: string;
    tags?: string[];
    sortBy?: 'latest' | 'oldest';
    isPublic?: boolean;
  }
  ```
- **응답 데이터**:
  ```typescript
  interface IGalleryResponse {
    images: Array<{
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
  }
  ```
- **응답 데이터**:
  ```typescript
  interface IUploadResponse {
    success: boolean;
    image?: {
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
    title?: string;
    description?: string;
    category?: string;
    tags?: string[];
    isPublic?: boolean;
  }
  ```
- **응답 데이터**:
  ```typescript
  interface IUpdateResponse {
    success: boolean;
    image?: {
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
      updatedAt: string;
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
    description: string;
    isPublic: boolean;
  }
  ```
- **응답 데이터**:
  ```typescript
  interface IShareResponse {
    success: boolean;
    post?: {
      id: string;
      imageUrl: string;
      title: string;
      description: string;
      userName: string;
      createdAt: string;
    };
    error?: {
      code: string;
      message: string;
    };
  }
  ``` 