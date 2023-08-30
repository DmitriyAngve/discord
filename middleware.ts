import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: ["/api/uploadthing"], // указываем, что маршрут "/api/uploadthing" являетс публичным, и лоя него не требуется аутентификация. Это означает, что любой пользователь может обращаться к маршруту без ограничений
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
