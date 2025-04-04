import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/webhook(.*)",
    "/_next(.*)",
    "/favicon.ico",
    "/images(.*)",
    "/fonts(.*)",
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};