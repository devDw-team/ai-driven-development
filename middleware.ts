import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',                    // 메인 페이지
  '/sign-in(.*)',         // 로그인 페이지
  '/sign-up(.*)',         // 회원가입 페이지
  '/api/webhook(.*)',     // Clerk 웹훅
  '/_next(.*)',          // Next.js 내부 라우트
  '/favicon.ico',        // 파비콘
  '/images(.*)',         // 이미지 파일
  '/fonts(.*)',          // 폰트 파일
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files
        '/((?!.*\\..*|_next).*)',
        '/',
        '/(api|trpc)(.*)'
    ]
}