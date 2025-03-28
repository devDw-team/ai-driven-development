## 이미지 생성 화면 기능명세서

---

### 프론트엔드 기능명세서

#### 1. 화면 레이아웃 및 디자인 명세

- **파일 위치**: `app/generate/page.tsx`

1. **프롬프트 입력 섹션**
   - **UI 구성**: 
     - ShadCN의 `Textarea` 컴포넌트를 사용하여 상단에 배치
     - 높이: 120px
     - 플레이스홀더: "원하는 이미지를 설명해주세요..."
     - 최대 글자 수: 500자
   - **상호작용**:
     - 실시간 글자 수 카운터 표시 (우측 하단)
     - 글자 수 초과 시 입력 제한
   - **오류 처리**:
     - 빈 입력 시 생성 버튼 비활성화
     - 최대 글자 수 초과 시 입력 제한
   - **데이터 연동**:
     - URL 쿼리 파라미터에서 프롬프트 자동 입력 및 디코딩

2. **스타일 옵션 섹션**
   - **UI 구성**: 
     - ShadCN의 `Select` 컴포넌트를 사용하여 스타일 옵션 선택
     - 그리드 레이아웃으로 옵션들을 배치 (모바일: 1열, 데스크톱: 2열)
   - **스타일 옵션**:
     - **아트 스타일**:
       - 디지털아트 (digital art style, high quality, detailed)
       - 수채화 (watercolor painting style, artistic, flowing)
       - 유화 (oil painting style, textured, rich colors)
       - 펜화 (pen and ink style, clean lines, detailed)
       - 연필화 (pencil sketch style, artistic, detailed)
       - 로고_미니멀 (minimalist logo design, clean, simple)
       - 로고_3D (3D logo design, modern, depth)
       - 로고_그라디언트 (gradient logo design, modern, colorful)
       - 로고_빈티지 (vintage logo design, retro style)
       - 로고_모던 (modern logo design, contemporary)
     - **색감**:
       - 밝은 (bright and vibrant colors)
       - 어두운 (dark and moody colors)
       - 파스텔 (pastel color palette, soft)
       - 흑백 (black and white, monochrome)
       - 컬러풀 (colorful and vibrant palette)
       - 모노톤 (monotone color scheme)
       - 메탈릭 (metallic colors, shiny)
   - **상호작용**:
     - 각 옵션 선택 시 시각적 피드백 제공
     - 기본값 설정: 디지털아트, 컬러풀

3. **이미지 생성 버튼**
   - **UI 구성**:
     - ShadCN의 `Button` 컴포넌트 사용
     - 크기: large
     - 중앙 정렬
     - 반응형 너비 (모바일: 전체 너비, 데스크톱: 자동)
   - **상호작용**:
     - 클릭 시 로딩 상태로 변경
     - 로딩 중에는 버튼 비활성화
     - 로딩 중일 때 Loader2 아이콘 표시
   - **오류 처리**:
     - 프롬프트 미입력 시 버튼 비활성화

4. **로딩 상태 표시**
   - **UI 구성**:
     - ShadCN의 `Progress` 컴포넌트 사용
     - 진행률 텍스트 표시 (중앙)
     - 취소 버튼 제공
   - **상호작용**:
     - 진행률 업데이트
     - 취소 버튼으로 생성 중단 가능

5. **생성 결과 섹션**
   - **UI 구성**:
     - ShadCN의 `Card` 컴포넌트 사용
     - 생성된 이미지를 큰 크기로 표시
     - 이미지 아래 액션 버튼들 배치 (중앙 정렬)
   - **액션 버튼**:
     - 다시 생성 (RefreshCw 아이콘)
     - 저장하기 (Save 아이콘)
     - 다운로드 (Download 아이콘)
     - 커뮤니티 공유 (Share2 아이콘)
   - **상호작용**:
     - 모든 버튼에 아이콘 포함
     - 버튼 클릭 시 해당 기능 실행
     - 기능 실행 결과를 Sonner 토스트로 표시

#### 2. 사용자 흐름 및 상호작용

1. **이미지 생성 프로세스**
   - URL 쿼리 파라미터에서 프롬프트 자동 입력
   - 스타일 옵션 선택
   - 생성 버튼 클릭
   - 로딩 상태 표시
   - 결과 표시

2. **결과 후 액션**
   - 다시 생성: 새로운 옵션으로 재시도
   - 저장하기: "이미지가 갤러리에 저장되었습니다" 토스트 메시지
   - 다운로드: 로컬에 이미지 저장 및 "이미지가 다운로드되었습니다" 토스트 메시지
   - 커뮤니티 공유: "커뮤니티 공유 기능은 현재 준비 중입니다" 토스트 메시지

#### 3. 테스트 항목

1. **프롬프트 입력**
   - 텍스트 입력 필드 정상 동작 확인
   - 글자 수 제한 기능 확인
   - 실시간 카운터 업데이트 확인
   - URL 쿼리 파라미터 자동 입력 확인

2. **스타일 옵션**
   - 모든 옵션 선택 가능 확인
   - 기본값 설정 확인
   - 반응형 레이아웃 확인

3. **이미지 생성**
   - 생성 버튼 활성화/비활성화 확인
   - 로딩 상태 표시 확인
   - 진행률 업데이트 확인
   - 취소 기능 확인

4. **결과 액션**
   - 다시 생성 기능 확인
   - 저장하기 토스트 메시지 확인
   - 다운로드 기능 확인
   - 커뮤니티 공유 토스트 메시지 확인

---

### 백엔드 기능명세서

#### 1. 이미지 생성 API

- **파일 위치**: `app/api/generate/route.ts`
- **HTTP 메서드**: `POST`
- **요청 데이터**:
  ```typescript
  interface IGenerateRequest {
    prompt: string;
    styleOptions: {
      artStyle: string;
      colorTone: string;
    };
  }
  ```
- **응답 데이터**:
  ```typescript
  // 성공 응답
  interface IGenerateResponse {
    success: true;
    imageUrl: string;
    generationId: string;
  }

  // 실패 응답
  interface IErrorResponse {
    success: false;
    error: {
      code: string;    // CONFIGURATION_ERROR | INVALID_PROMPT | GENERATION_FAILED | INTERNAL_ERROR
      message: string;
    };
  }
  ```
- **프롬프트 처리**:
  - 스타일 옵션에 따른 상세 프롬프트 매핑
  - 아트 스타일별 구체적인 프롬프트 설정
  - 색감별 구체적인 프롬프트 설정
- **Replicate API 연동**:
  - 모델: black-forest-labs/flux-schnell
  - 설정:
    - aspect_ratio: '16:9'
    - num_outputs: 1
    - output_format: 'webp'
    - output_quality: 90
- **에러 처리**:
  - API 토큰 미설정
  - 프롬프트 누락
  - 생성 실패
  - 내부 서버 오류

#### 2. 생성 결과 저장 API

- **파일 위치**: `app/api/generate/save/route.ts`
- **HTTP 메서드**: `POST`
- **요청 데이터**:
  ```typescript
  interface ISaveRequest {
    generationId: string;
    imageUrl: string;
    prompt: string;
    styleOptions: {
      artStyle: string;
      colorTone: string;
    };
  }
  ```
- **응답 데이터**:
  ```typescript
  interface ISaveResponse {
    success: boolean;
    savedImage?: {
      id: string;
      imageUrl: string;
      prompt: string;
      styleOptions: {
        artStyle: string;
        colorTone: string;
      };
      createdAt: string;
    };
    error?: {
      code: string;
      message: string;
    };
  }
  ```

#### 3. 생성 취소 API

- **파일 위치**: `app/api/generate/cancel/route.ts`
- **HTTP 메서드**: `POST`
- **요청 데이터**:
  ```typescript
  interface ICancelRequest {
    generationId: string;
  }
  ```
- **응답 데이터**:
  ```typescript
  interface ICancelResponse {
    success: boolean;
    error?: {
      code: string;
      message: string;
    };
  }
  ``` 