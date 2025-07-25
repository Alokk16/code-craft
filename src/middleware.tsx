import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  // Add the sign-in and sign-up routes to the publicRoutes array
  publicRoutes: ["/sign-in", "/sign-up"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};