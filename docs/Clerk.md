# Next.js와 Clerk 인증 시스템 연동하기

## 목차
1. [Clerk 설치](#1-clerk-설치)
2. [환경 변수 설정](#2-환경-변수-설정)
3. [Clerk Provider 설정](#3-clerk-provider-설정)
4. [미들웨어 설정](#4-미들웨어-설정)
5. [인증 페이지 생성](#5-인증-페이지-생성)
6. [사용자 인증 상태 활용](#6-사용자-인증-상태-활용)

## 1. Clerk 설치

Next.js 프로젝트에 Clerk 패키지를 설치합니다:

  ```bash
  npm install @clerk/nextjs
  ```

## 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 Clerk 대시보드에서 얻은 키를 설정합니다:

  ```env
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_**********
  CLERK_SECRET_KEY=sk_test_**********
  NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
  NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
  ```

## 3. Clerk Provider 설정

`app/layout.tsx` 파일에 ClerkProvider를 설정합니다:

  ```tsx
  import { ClerkProvider } from '@clerk/nextjs'
 
  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <ClerkProvider>
        <html lang="en">
          <body>{children}</body>
        </html>
      </ClerkProvider>
    )
  }
  ```

## 4. 미들웨어 설정

프로젝트 루트에 `middleware.ts` 파일을 생성하여 보호된 라우트를 설정합니다:

  ```typescript
  import { authMiddleware } from "@clerk/nextjs";
 
  export default authMiddleware({
    // 공개 접근이 가능한 라우트 설정
    publicRoutes: ["/", "/sign-in", "/sign-up"]
  });
 
  export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
  };
  ```

## 5. 인증 페이지 생성

### 로그인 페이지 생성 (app/sign-in/[[...sign-in]]/page.tsx):

  ```tsx
  import { SignIn } from "@clerk/nextjs";
 
  export default function SignInPage() {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <SignIn />
      </div>
    );
  }
  ```

### 회원가입 페이지 생성 (app/sign-up/[[...sign-up]]/page.tsx):

  ```tsx
  import { SignUp } from "@clerk/nextjs";
 
  export default function SignUpPage() {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <SignUp />
      </div>
    );
  }
  ```

## 6. 사용자 인증 상태 활용

### 메인 페이지에서 인증 상태 사용 예시 (app/page.tsx):

  ```tsx
  'use client';
 
  import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
 
  export default function Home() {
    const { user } = useUser();
    
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          <div className="mb-8 flex justify-end">
            <UserButton />
          </div>
          
          <div className="text-center">
            <SignedIn>
              <h1 className="text-3xl font-bold">
                {user?.firstName || user?.username || '사용자'}님, 환영합니다!
              </h1>
            </SignedIn>
            
            <SignedOut>
              <h1 className="text-3xl font-bold">
                로그인을 진행해 주세요.
              </h1>
              <a
                href="/sign-in"
                className="mt-4 inline-block rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
              >
                로그인하기
              </a>
            </SignedOut>
          </div>
        </div>
      </div>
    );
  }
  ```

## 주요 컴포넌트 및 훅

- `<SignedIn>`: 인증된 사용자에게만 보이는 컨텐츠를 감싸는 컴포넌트
- `<SignedOut>`: 비인증 사용자에게만 보이는 컨텐츠를 감싸는 컴포넌트
- `<UserButton>`: 사용자 프로필 버튼 컴포넌트
- `useUser()`: 현재 사용자 정보를 가져오는 훅
- `useAuth()`: 인증 상태 및 메서드를 제공하는 훅

## 보안 설정

민감한 정보는 항상 환경 변수를 통해 관리하고, 프로덕션 환경에서는 실제 Clerk 키를 사용해야 합니다. `.gitignore` 파일에 `.env.local`이 포함되어 있는지 확인하세요. 